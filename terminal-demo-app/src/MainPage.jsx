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
      cancelablePayment: false,
      logs: []
    };

    Logger.setCollectors([this]);
  }

  collect(log) {
    console.log(log);
    this.setState(state => state.logs.push(log));
  }

  // 1. Stripe Terminal Initialization
  initializeBackendAndTerminal(url) {
    this.backend = new Backend(url);

    this.terminal = window.StripeTerminal.create({
      onFetchConnectionToken: async () => {
        let connectionTokenResult = await this.backend.createConnectionToken();
        return connectionTokenResult.secret;
      },
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

  async connectToReader(selectedReader) {
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
  }

  async disconnectReader() {
    await this.terminal.disconnectReader();
    this.setState({
      reader: null
    });
  }

  async registerAndConnectNewReader(label, code) {
    let reader = await this.backend.registerDevice(label, code);
    await this.connectToReader(reader);
    console.log("Registered and Connected Successfully!");
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
    this.setState({ cancelablePayment: false });
  }

  async saveCardForFutureUse() {
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
  }

  handleUseSimulator = async () => {
    let simulatedResults = await this.discoverReaders(true);
    await this.connectToReader(simulatedResults[0]);
  };

  onSetBackendURL = url => {
    this.initializeBackendAndTerminal(url);
    this.setState({ backendURL: url });
  };

  onSetReader = reader => {
    this.setState({ reader });
  };

  renderForm() {
    const { backendURL, reader, discoveredReaders } = this.state;
    if (backendURL === null && reader === null) {
      return <BackendURLForm onSetBackendURL={this.onSetBackendURL} />;
    } else if (reader === null) {
      return (
        <Readers
          onClickDiscover={this.discoverReaders}
          onSetReader={this.onSetReader}
          readers={discoveredReaders}
          handleUseSimulator={this.handleUseSimulator}
        />
      );
    } else {
      return <CommonWorkflows />;
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
              onSetReader={this.onSetReader}
              onSetBackendURL={this.onSetBackendURL}
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
