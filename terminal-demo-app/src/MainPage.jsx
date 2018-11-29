import React, { Component } from "react";

import Backend from "./backend";
import Logger from "./logger";

import BackendURLForm from "./Forms/BackendURLForm.jsx";
import CommonWorkflows from "./Forms/CommonWorkflows.jsx";
import ConnectionInfo from "./ConnectionInfo/ConnectionInfo.jsx";
import Readers from "./Forms/Readers.jsx";
import Group from "./components/Group/Group.jsx";
import Logs from "./Logs/Logs.jsx";

import { css } from "emotion";

class App extends Component {
  static CHARGE_AMOUNT = 5100;

  constructor(props) {
    super(props);
    this.state = {
      status: "requires_initializing", // requires_connecting || reader_registration || workflows
      backendURL: null,
      discoveredReaders: [],
      connectionStatus: "not_connected",
      reader: null,
      readerLabel: "",
      registrationCode: "",
      cancelablePayment: false
    };
  }

  // 1. Stripe Terminal Initialization
  initializeBackendAndTerminal(url) {
    // 1a. Initialize JS class to fascilitate communication to backend
    this.backend = new Backend(url);

    // 1b. Initialize the Stripe Terminal object
    this.terminal = window.StripeTerminal.create({
      // 1c. Create a callback that will return a new connection token secret when called
      onFetchConnectionToken: async () => {
        let connectionTokenResult = await this.backend.createConnectionToken();
        return connectionTokenResult.secret;
      },
      // 1c. (Optionally) Create a callback that will be called if the reader unexpectedly disconnects.
      // You likely will want to alert your user that the reader is no longer connected and will need to be reconnected.
      onUnexpectedReaderDisconnect: Logger.tracedFn(
        "onUnexpectedReaderDisconnect",
        () => {
          alert("Unexpected disconnect from the reader!");
          this.setState({
            connectionStatus: "not_connected",
            reader: null
          });
        }
      ),
      // 1c. (Optionally) Create a callback that will update your UI with the connection state of the reader.
      onConnectionStatusChange: Logger.tracedFn(
        "onConnectionStatusChange",
        ev => {
          this.setState({ connectionStatus: ev.status, reader: null });
        }
      )
    });
    Logger.watchObject(this.backend, "backend", [
      "createConnectionToken",
      "registerDevice",
      "createPaymentIntent",
      "capturePaymentIntent",
      "saveSourceToCustomer"
    ]);
    Logger.watchObject(this.terminal, "terminal", [
      "discoverReaders",
      "connectReader",
      "setReaderDisplay",
      "collectPaymentMethod",
      "cancelCollectPaymentMethod",
      "confirmPaymentIntent",
      "readSource"
    ]);
  }

  // 2. Terminal Connection Management: Discovery and Connecting
  discoverReaders = async (useSimulator = false) => {
    // 2a. Discover either a simulated or registered readers to connect to.
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
  };

  connectToReader = async selectedReader => {
    // 2b. Connect to a discovered reader.
    const connectResult = await this.terminal.connectReader(selectedReader);
    if (connectResult.error) {
      console.log("Failed to connect:", connectResult.error);
    } else {
      this.setState({
        status: "workflows",
        discoveredReaders: [],
        reader: connectResult.connection.reader
      });
      return connectResult.connection;
    }
  };

  disconnectReader = async () => {
    //2c. Disconnect from the reader in case the user wants to switch readers.
    await this.terminal.disconnectReader();
    this.setState({
      reader: null
    });
  };

  registerAndConnectNewReader = async (label, code) => {
    let reader = await this.backend.registerDevice(label, code);
    // When registering a new reader, we can just without discovery using the reader object returned from the server.
    await this.connectToReader(reader);
    console.log("Registered and Connected Successfully!");
  };

  // 3. Terminal Workflows (Once Connected)
  updateLineItems = async () => {
    // 3a. Update the reader display to show cart contents to the customer
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
  };

  // 3b. Collect a card present payment
  collectCardPayment = async () => {
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
    this.setState({ cancelablePayment: true });
    const result = await paymentMethodPromise;
    if (result.error) {
      alert(`Collect payment method failed: ${result.error.message}`);
    } else {
      // Can no longer cancel the pending payment because we are sending the request to the network.
      const confirmResult = await this.terminal.confirmPaymentIntent(
        result.paymentIntent
      );
      this.setState({ cancelablePayment: false });
      if (confirmResult.error) {
        alert(`Confirm failed: ${confirmResult.error.message}`);
      } else if (confirmResult.paymentIntent) {
        // Capture the PaymentIntent from your backend and mark the payment as complete
        let captureResult = await this.backend.capturePaymentIntent(
          confirmResult.paymentIntent.id
        );
        this.pendingPaymentIntentSecret = null;
        console.log("Payment Successful!");
        return captureResult;
      }
    }
  };

  // 3c. Cancel a pending payment.
  // Note this can only be done before calling `confirmPaymentIntent` because after that call the charge request will be sent to the network.
  cancelPendingPayment = async () => {
    await this.terminal.cancelCollectPaymentMethod();
    this.setState({ cancelablePayment: false });
  };

  // 3d. Save a card present source for use with billing/subscriptions
  saveCardForFutureUse = async () => {
    // First read a card without charging it or use the card_present type source from a PaymentIntent completed using flow 3b
    const readSourceResult = await this.terminal.readSource();
    if (readSourceResult.error) {
      alert(`Read source failed: ${readSourceResult.error.message}`);
    } else {
      // Pass to Backend to actually save to a customer
      let customer = await this.backend.saveSourceToCustomer(
        readSourceResult.source.id
      );
      console.log("Source Saved to Customer!", customer);
      return customer;
    }
  };

  // 4. UI Methods
  handleUseSimulator = async () => {
    let simulatedResults = await this.discoverReaders(true);
    await this.connectToReader(simulatedResults[0]);
  };

  onSetBackendURL = url => {
    this.initializeBackendAndTerminal(url);
    this.setState({ backendURL: url });
  };

  renderForm() {
    const {
      backendURL,
      cancelablePayment,
      reader,
      discoveredReaders
    } = this.state;
    if (backendURL === null && reader === null) {
      return <BackendURLForm onSetBackendURL={this.onSetBackendURL} />;
    } else if (reader === null) {
      return (
        <Readers
          onClickDiscover={() => this.discoverReaders(false)}
          onClickRegister={this.registerAndConnectNewReader}
          readers={discoveredReaders}
          onConnectToReader={this.connectToReader}
          handleUseSimulator={this.handleUseSimulator}
        />
      );
    } else {
      return (
        <CommonWorkflows
          onClickUpdateLineItems={this.updateLineItems}
          onClickCollectCardPayments={this.collectCardPayment}
          onClickSaveCardForFutureUse={this.saveCardForFutureUse}
          onClickCancelPayment={this.cancelPendingPayment}
          cancelablePayment={cancelablePayment}
        />
      );
    }
  }

  render() {
    const { backendURL, reader } = this.state;
    return (
      <div
        className={css`
          padding: 41px 10vw;
        `}
      >
        <Group direction="row" spacing={43} responsive>
          <Group direction="column" spacing={16} responsive>
            <ConnectionInfo
              backendURL={backendURL}
              reader={reader}
              onSetBackendURL={this.onSetBackendURL}
              onClickDisconnect={this.disconnectReader}
            />
            {this.renderForm()}
          </Group>
          <Logs />
        </Group>
      </div>
    );
  }
}

export default App;
