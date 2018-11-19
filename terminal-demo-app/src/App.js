import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Backend from './backend';

class App extends Component {
  CHARGE_AMOUNT = 5100;
  
  constructor(props) {
    super(props);    
    this.state = { 
      useSimulator: true,      
      discoveredReaders: null,
      connectionStatus: 'not_connected',
      connectedReader: null,      
    };
    
    
  }

  // 1. Stripe Terminal Initialization
  initializeBackendAndTerminal(url) {
    this.backend = new Backend('https://my-example-backend.herokuapp.com/');    
    
    this.terminal = StripeTerminal.create({      
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
  updateLineItems() {
    await this.terminal.setReaderDisplay({
      type: 'cart',
      cart: {
        lineItems: [
          {
            description: "Blue Shirt",
            amount: CHARGE_AMOUNT,
            quantity: 1,
          },          
        ],
        tax: 0,
        total: CHARGE_AMOUNT,
        currency: 'usd',
      },
    });
  }

  async collectCardPayment() {
    const result = await this.terminal.collectPaymentMethod(clientSecret);
    if (result.error) {
      alert(`Collect payment method failed: ${result.error.message}`);
    } else {            
      const confirmResult = await this.terminal.confirmPaymentIntent(result.paymentIntent);
      if (confirmResult.error) {
        alert(`Confirm failed: ${confirmResult.error.message}`);
      } else if (confirmResult.paymentIntent) {
        // Placeholder for notifying your backend to capture the PaymentIntent

        // Success!
      }
    }
  }

  saveCardForFutureUse() {
    const readSourceResult = await this.terminal.readSource()
    if (readSourceResult.error) {
      alert(`Read source failed: ${readSourceResult.error.message}`);
    } else {
      // Pass to Backend to actually save to a customer
    }
  }

  // UI
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
