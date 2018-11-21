import React, { Component } from "react";
import "./App.css";
import Backend from "./backend";
import Logger from "./logger"

class App extends Component {
  static CHARGE_AMOUNT = 5100;

  constructor(props) {
    super(props);
    this.state = {
      status: 'requires_initializing', // requires_connecting || reader_registration || workflows
      backendUrl: '',
      discoveredReaders: null,
      connectionStatus: "not_connected",
      connectedReader: null,
      readerLabel: '',
      registrationCode: '',
      cancelablePayment: false,        
      logs: []
    };

    Logger.setCollectors([this])
  }

  collect(log) {    
    console.log(log)
    this.setState(state => state.logs.push(log))         
  }

  // 1. Stripe Terminal Initialization
  initializeBackendAndTerminal(url) {
    this.backend = new Backend(url);

    this.terminal = window.StripeTerminal.create({
      onFetchConnectionToken: async () => {
        let connectionTokenResult = await this.backend.createConnectionToken();
        return connectionTokenResult.secret;
      },
      onUnexpectedReaderDisconnect: Logger.tracedFn("onUnexpectedReaderDisconnect", () => {
        alert("Unexpected disconnect from the reader!");
        this.setState({
          connectionStatus: "not_connected",
          connectedReader: null
        });
      }),
      onConnectionStatusChange: Logger.tracedFn("onConnectionStatusChange", ev => {
        this.setState({ connectionStatus: ev.status, connectedReader: null });
      })
    });
    Logger.watchObject(this.backend, "backend", [
      'createConnectionToken',
      'registerDevice',
      'createPaymentIntent',
      'capturePaymentIntent',
      'saveSourceToCustomer',
    ])
    Logger.watchObject(this.terminal, "terminal", [
      'discoverReaders',
      'connectReader',
      'setReaderDisplay',
      'collectPaymentMethod',
      'cancelCollectPaymentMethod',
      'confirmPaymentIntent',
      'readSource'
    ])

    this.setState({ status: 'requires_connecting' });    
  }

  // 2. Terminal Connection Management: Discovery and Connecting
  async discoverReaders(useSimulator=false) {
    const discoverResult = await this.terminal.discoverReaders({
      method: useSimulator ? "simulated" : "registered"
    });

    if (discoverResult.error) {
      console.log("Failed to discover: ", discoverResult.error);
    } else {
      this.setState({
        discoveredReaders: discoverResult.discoveredReaders
      });
      return discoverResult.discoveredReaders;
    }
  }

  async connectToReader(selectedReader) {
    const connectResult = await this.terminal.connectReader(selectedReader);
    if (connectResult.error) {
      console.log("Failed to connect:", connectResult.error);
    } else {
      this.setState({
        status: 'workflows',
        discoveredReaders: null,
        connectedReader: connectResult.connection.reader
      });
      return connectResult.connection;
    }
  }

  async disconnectReader() {
    await this.terminal.disconnectReader();
    this.setState({
      connectedReader: null
    });
  }

  async registerAndConnectNewReader(label, code) {
    let reader = await this.backend.registerDevice(label, code);
    await this.connectToReader(reader)
    console.log("Registered and Connected Successfully!")
   }

  // 3. Terminal Workflows (Once Connected)
  async updateLineItems() {
    await this.terminal.setReaderDisplay({
      type: "cart",
      cart: {
        lineItems: [
          {
            description: "Blue Shirt",
            amount: App.CHARGE_AMOUNT,
            quantity: 1
          }
        ],
        tax: 0,
        total: App.CHARGE_AMOUNT,
        currency: "usd"
      }
    });
    console.log("Reader Display Updated!");
  }

  async collectCardPayment() {
    // We want to make sure we reuse the same PaymentIntent object in the case of declined charges so we
    // store the pending PaymentIntent's secret until it has been fulfilled.
    if (!this.pendingPaymentIntentSecret) {
      let createIntentResponse = await this.backend.createPaymentIntent(
        App.CHARGE_AMOUNT,
        "usd",
        "Test Charge"
      );
      this.pendingPaymentIntentSecret = createIntentResponse.secret;
    }
    // Read a card from the customer
    const paymentMethodPromise = this.terminal.collectPaymentMethod(
      this.pendingPaymentIntentSecret
    );
    this.setState({cancelablePayment: true})
    const result = await paymentMethodPromise;    
    if (result.error) {
      alert(`Collect payment method failed: ${result.error.message}`);
    } else {
      // Can no longer cancel the pending payment because we are sending the request to the network.
      const confirmResult = await this.terminal.confirmPaymentIntent(
        result.paymentIntent
      );
      this.setState({cancelablePayment: false})
      if (confirmResult.error) {
        alert(`Confirm failed: ${confirmResult.error.message}`);
      } else if (confirmResult.paymentIntent) {
        let captureResult = await this.backend.capturePaymentIntent(
          confirmResult.paymentIntent.id
        );
        this.pendingPaymentIntentSecret = null;
        console.log("Payment Successful!");
        return captureResult;
      }
    }
  }

  async cancelPendingPayment() {
    let cancel = await this.terminal.cancelCollectPaymentMethod();
    this.setState({cancelablePayment: false})
  }

  async saveCardForFutureUse() {
    const readSourceResult = await this.terminal.readSource();
    if (readSourceResult.error) {
      alert(`Read source failed: ${readSourceResult.error.message}`);
    } else {
      // Pass to Backend to actually save to a customer
      let customer = await this.backend.saveSourceToCustomer(readSourceResult.source.id)
      console.log("Source Saved to Customer!", customer);
      return customer;
    }
  }

  // UI
  handleBackendUrlChange = (e) => this.setState({backendUrl: e.target.value})
  handleSetBackendUrl = () => this.initializeBackendAndTerminal(this.state.backendUrl)

  renderBackendUrlInput() {
    if (this.state.status !== 'requires_initializing') {
      return <b>{this.state.backendUrl}</b>
    } else {
      return (
        <section>
          <label>Backend URL</label>
          <input type="url" className="form-control" id="backendUrl" placeholder="Enter Backend URL"
                  value={this.state.backendUrl} onChange={this.handleBackendUrlChange}>
          </input>
          <small id="backendUrlHelp" className="form-text text-muted">Follow the set up guide at https://github.com/stripe/example-terminal-backend to set one up.</small>
          <button className="btn btn-primary" onClick={this.handleSetBackendUrl}>Ok</button>
        </section>
      )
    }
  }

  handleDiscoverClick = () => this.discoverReaders();
  handleDisconnectClick = () => this.disconnectReader();
  handleRegisterMode = () => {
    this.setState({status: 'reader_registration'})
  }
  handleDiscoverMode = () => {
    this.setState({status: 'requires_connecting'})
  }
  handleConnectClick = (reader) => this.connectToReader(reader);
  handleUseSimulator = async () => {
    let simulatedResults = await this.discoverReaders(true);
    await this.connectToReader(simulatedResults[0])
  }

  handleReaderLabelChange = (e) => this.setState({readerLabel: e.target.value})
  handleRegistrationCodeChange = (e) => this.setState({registrationCode: e.target.value})
  handleRegisterNewDevice = () => this.registerAndConnectNewReader(this.state.readerLabel, this.state.registrationCode)

  renderReaderConnectionManager() {
    if (this.state.status === 'reader_registration') {
      return (
        <section>
          <input type="url" className="form-control" placeholder="Enter Reader Label"
                  value={this.state.readerLabel} onChange={this.handleReaderLabelChange}>
          </input>
          <input type="url" className="form-control" placeholder="Enter Registration Code"
                  value={this.state.registrationCode} onChange={this.handleRegistrationCodeChange}>
          </input>
          <button className="btn btn-primary" onClick={this.handleRegisterNewDevice}>Ok</button>
          <button className="btn btn-primary" onClick={this.handleDiscoverMode}>Cancel</button>
        </section>
      )
    }

    if (this.state.connectionStatus === 'connected' && this.state.connectedReader) {
      return (
        <section>
          <b>{this.state.connectedReader.label}</b>                    
          <button onClick={this.handleDisconnectClick}>Disconnect</button>
        </section>
      )
    } else if (this.state.connectionStatus === 'connecting') {
      return (
        <div>
          <b>Connecting...</b>                    
        </div>
      )
    } else {
      return (
        <section>
          <h4>Discover Readers</h4>                  
          <button onClick={this.handleDiscoverClick}>Discover</button>
          { this.state.discoveredReaders == null ? 
            <div>
              Click Discover to Discover Readers
            </div>
            : this.state.discoveredReaders.length === 0 ? 
            <div>
              No Readers Registered.
            </div>
            : this.state.discoveredReaders.map((reader) => 
              <div>
                <b>{reader.label}</b>
                <div>
                  {reader.device_type}
                </div>
                <div>                  
                  <small>{reader.serial_number} - {reader.ip_address}</small>
                </div>
                {
                  reader.status === 'online' ?
                  <button onClick={() => this.handleConnectClick(reader)}>Connect</button>
                  : <button disabled="true">Offline</button>
                }                                    
              </div>          
            )
          }          
          <div className="btn-group" role="group" aria-label="Basic example">
            <button type="button" className="btn btn-secondary" onClick={this.handleRegisterMode}>Register New Device</button>                    
            <button type="button" className="btn btn-secondary" onClick={this.handleUseSimulator}>Use Simulator</button>
          </div>
        </section>
      )
    }    
  }

  handleUpdateReaderDisplay = () => this.updateLineItems();
  handleCollectCardPayment = () => this.collectCardPayment();
  handleCancelPayment = () => this.cancelPendingPayment();
  handleSaveCardForFutureUse = () => this.saveCardForFutureUse();

  renderCommonWorkflows() {
    return (
      <section>
        <h4>Common Workflows</h4>                  
        <div>
          <button className="btn btn-secondary" onClick={this.handleUpdateReaderDisplay}>Update Line Items And Totals</button>
        </div>
        <div>
          {this.state.cancelablePayment ? 
            <button className="btn btn-secondary" onClick={this.handleCancelPayment}>Cancel Payment</button>  
          :
            <button className="btn btn-secondary" onClick={this.handleCollectCardPayment}>Collect Card Payments</button>  
          }
        </div>
        <div>
          <button className="btn btn-secondary" onClick={this.handleSaveCardForFutureUse}>Save Card For Future Use</button>                    
        </div>
      </section>      
    )
  }


  render() {
    return (
      <div className="App">
        <div className="container-fluid">
          <div className="row">            
            <div className="col-4">              
                {this.renderBackendUrlInput()}
                <hr />
                {this.state.status !== 'requires_initializing' ? 
                  <div>
                    {this.renderReaderConnectionManager()}
                    <hr />
                    {this.state.connectionStatus === 'connected' ? 
                      this.renderCommonWorkflows() 
                      : ''
                    }                    
                  </div>
                : ''}                
            </div>
            <div className="col">
              {this.state.logs.map(log => 
                <div>
                  <h4>{log.method}</h4>
                  <small>{new Date(log.start_time_ms).toString()}</small>
                  Request:
                  <pre>
                    <code>
                      {log.request}
                    </code>
                  </pre>
                  {log.exception ? 'Exception:' : 'Response:'}
                  <pre>                    
                    <code>
                      {log.response || log.exception || 'void'}
                    </code>
                  </pre>        
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
