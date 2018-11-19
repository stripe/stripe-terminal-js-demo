import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Backend from './backend';

class App extends Component {
  static CHARGE_AMOUNT = 5100;
  
  constructor(props) {
    super(props);    
    this.state = { 
      useSimulator: true,      
      discoveredReaders: null,
      connectionStatus: 'not_connected',
      connectedReader: null,      
    };
    let fn = async () => {
      this.initializeBackendAndTerminal();
      let results = await this.discoverReaders();
      await this.connectToReader(results[0])
  
      await this.updateLineItems();
      await this.saveCardForFutureUse();
      await this.collectCardPayment();
    }

    fn();
    
  }  

  // 1. Stripe Terminal Initialization
  initializeBackendAndTerminal(url) {
    this.backend = new Backend('http://localhost:4567');    
    
    this.terminal = window.StripeTerminal.create({      
      onFetchConnectionToken: async () => {
        let connectionTokenResult = await this.backend.createConnectionToken();
        return connectionTokenResult.secret;
      },
      onUnexpectedReaderDisconnect: () => {
        alert("Unexpected disconnect from the reader!")
        this.setState({ connectionStatus: 'not_connected', connectedReader: null })
      },
      onConnectionStatusChange: (ev) => {        
        this.setState({ connectionStatus: ev.status, connectedReader: null })
      },
    });
  }
  
  // 2. Terminal Connection Management: Discovery and Connecting
  async discoverReaders() {
    const discoverResult = await this.terminal.discoverReaders({
      method: this.state.useSimulator ? 'simulated' : 'registered'
    });

    if (discoverResult.error) {
      console.log('Failed to discover: ', discoverResult.error);
    } else {
      this.setState({
        discoveredReaders: discoverResult.discoveredReaders
      })
      return discoverResult.discoveredReaders;
    }
  }

  async connectToReader(selectedReader) {        
    const connectResult = await this.terminal.connectReader(selectedReader);
    if (connectResult.error) {
      console.log('Failed to connect:', connectResult.error);
    } else {
      this.setState({
        connectedReader: connectResult.connection.reader
      })
    }
  }

  async disconnectReader() {
    await this.terminal.disconnectReader();
    this.setState({
      connectedReader: null
    })
  }
  
  // 3. Terminal Workflows (Once Connected)
  async updateLineItems() {
    this.terminal.setReaderDisplay({
      type: 'cart',
      cart: {
        lineItems: [
          {
            description: "Blue Shirt",
            amount: App.CHARGE_AMOUNT,
            quantity: 1,
          },          
        ],
        tax: 0,
        total: App.CHARGE_AMOUNT,
        currency: 'usd',
      },
    });
  }

  async collectCardPayment() {
    // We want to make sure we reuse the same PaymentIntent object in the case of declined charges so we
    // store the pending PaymentIntent's secret until it has been fulfilled.
    if (!this.pendingPaymentIntentSecret) {
      let createIntentResponse = await this.backend.createPaymentIntent(App.CHARGE_AMOUNT, 'usd', "Test Charge");
      this.pendingPaymentIntentSecret = createIntentResponse.secret;
    }    
    
    const result = await this.terminal.collectPaymentMethod(this.pendingPaymentIntentSecret);
    if (result.error) {
      alert(`Collect payment method failed: ${result.error.message}`);
    } else {            
      const confirmResult = await this.terminal.confirmPaymentIntent(result.paymentIntent);
      if (confirmResult.error) {
        alert(`Confirm failed: ${confirmResult.error.message}`);
      } else if (confirmResult.paymentIntent) {
        console.log(confirmResult)
        await this.backend.capturePaymentIntent(confirmResult.paymentIntent.id);
        console.log("Payment Successful!")
      }
    }
  }

  async saveCardForFutureUse() {
    const readSourceResult = await this.terminal.readSource()
    if (readSourceResult.error) {
      alert(`Read source failed: ${readSourceResult.error.message}`);
    } else {
      // Pass to Backend to actually save to a customer
      console.log(readSourceResult)
      return readSourceResult.source;
    }
  }

  // UI
  render() {
    return (
      <div className="App">
        
      </div>
    );
  }
}

export default App;
