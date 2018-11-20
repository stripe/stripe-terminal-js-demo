import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Backend from "./backend";

class App extends Component {
  static CHARGE_AMOUNT = 5100;

  constructor(props) {
    super(props);
    this.state = {
      initialized: false,
      backendUrl: '',
      discoveredReaders: null,
      connectionStatus: "not_connected",
      connectedReader: null
    };
    // let fn = async () => {
    //   this.initializeBackendAndTerminal();
    //   let results = await this.discoverReaders();
    //   await this.connectToReader(results[0]);

    //   await this.updateLineItems();
    //   await this.saveCardForFutureUse();
    //   await this.collectCardPayment();
    // };

    // fn();
  }

  // 1. Stripe Terminal Initialization
  initializeBackendAndTerminal(url) {
    this.backend = new Backend("http://localhost:4567");

    this.terminal = window.StripeTerminal.create({
      onFetchConnectionToken: async () => {
        let connectionTokenResult = await this.backend.createConnectionToken();
        return connectionTokenResult.secret;
      },
      onUnexpectedReaderDisconnect: () => {
        alert("Unexpected disconnect from the reader!");
        this.setState({
          connectionStatus: "not_connected",
          connectedReader: null
        });
      },
      onConnectionStatusChange: ev => {
        this.setState({ connectionStatus: ev.status, connectedReader: null });
      }
    });

    this.setState({ initialized: true });    
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

    const result = await this.terminal.collectPaymentMethod(
      this.pendingPaymentIntentSecret
    );
    if (result.error) {
      alert(`Collect payment method failed: ${result.error.message}`);
    } else {
      const confirmResult = await this.terminal.confirmPaymentIntent(
        result.paymentIntent
      );
      if (confirmResult.error) {
        alert(`Confirm failed: ${confirmResult.error.message}`);
      } else if (confirmResult.paymentIntent) {
        let captureResult = await this.backend.capturePaymentIntent(
          confirmResult.paymentIntent.id
        );
        console.log("Payment Successful!");
        return captureResult;
      }
    }
  }

  async saveCardForFutureUse() {
    const readSourceResult = await this.terminal.readSource();
    if (readSourceResult.error) {
      alert(`Read source failed: ${readSourceResult.error.message}`);
    } else {
      // Pass to Backend to actually save to a customer
      console.log("Source Saved!");
      return readSourceResult.source;
    }
  }

  // UI
  handleBackendUrlChange = (e) => this.setState({backendUrl: e.target.value})
  handleSetBackendUrl = () => this.initializeBackendAndTerminal(this.state.backendUrl)

  renderBackendUrlInput() {
    if (this.state.initialized) {
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
  handleConnectClick = (reader) => this.connectToReader(reader);
  handleUseSimulator = async () => {
    let simulatedResults = await this.discoverReaders(true);
    await this.connectToReader(simulatedResults[0])
  }

  renderReaderConnectionManager() {
    if (this.state.connectionStatus === 'connected') {
      return (
        <div>
          <b>Reader Label</b>                    
          <button onClick={this.handleDisconnectClick}>Disconnect</button>
        </div>
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
                  <small>{reader.serial_number} - {reader.ip_address}</small>
                </div>                    
                <button onClick={() => this.handleConnectClick(reader)}>Connect</button>
              </div>          
            )
          }          
          <div className="btn-group" role="group" aria-label="Basic example">
            <button type="button" className="btn btn-secondary">Register New Device</button>                    
            <button type="button" className="btn btn-secondary" onClick={this.handleUseSimulator}>Use Simulator</button>
          </div>
        </section>
      )
    }    
  }

  handleUpdateReaderDisplay = () => this.updateLineItems();
  handleCollectCardPayment = () => this.collectCardPayment();
  handleSaveCardForFutureUse = () => this.saveCardForFutureUse();

  renderCommonWorkflows() {
    return (
      <section>
        <h4>Common Workflows</h4>                  
        <div>
          <button className="btn btn-secondary" onClick={this.handleUpdateReaderDisplay}>Update Line Items And Totals</button>
        </div>
        <div>
          <button className="btn btn-secondary" onClick={this.handleCollectCardPayment}>Collect Card Payments</button>  
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
                {this.state.initialized ? 
                  <div>
                    {this.renderReaderConnectionManager()}
                    <hr />
                    {this.state.connectionStatus === 'connected' ? 
                      this.renderCommonWorkflows() 
                      : ''
                    }
                    <hr />
                  </div>
                : ''}                
            </div>
            <div className="col">Logs Go Here :)</div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
