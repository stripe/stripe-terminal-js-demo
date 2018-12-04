import React, { Component } from "react";

import Client from "./client";
import Logger from "./logger";

import BackendURLForm from "./Forms/BackendURLForm.jsx";
import CommonWorkflows from "./Forms/CommonWorkflows.jsx";
import ConnectionInfo from "./ConnectionInfo/ConnectionInfo.jsx";
import Readers from "./Forms/Readers.jsx";
import Group from "./components/Group/Group.jsx";
import Logs from "./Logs/Logs.jsx";
import Text from "./components//Text/Text.jsx";

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
  initializeBackendClientAndTerminal(url) {
    // 1a. Initialize Client class, which communicates with the example terminal backend
    this.client = new Client(url);

    // 1b. Initialize the StripeTerminal object
    this.terminal = window.StripeTerminal.create({
      // 1c. Create a callback that retrieves a new ConnectionToken from the example backend
      onFetchConnectionToken: async () => {
        let connectionTokenResult = await this.client.createConnectionToken();
        return connectionTokenResult.secret;
      },
      // 1c. (Optional) Create a callback that will be called if the reader unexpectedly disconnects.
      // You can use this callback to alert your user that the reader is no longer connected and will need to be reconnected.
      onUnexpectedReaderDisconnect: Logger.tracedFn(
        "onUnexpectedReaderDisconnect",
        "https://stripe.com/docs/terminal/js/reference#stripeterminal-create",
        () => {
          alert("Unexpected disconnect from the reader!");
          this.setState({
            connectionStatus: "not_connected",
            reader: null
          });
        }
      ),
      // 1c. (Optional) Create a callback that will be called when the reader's connection status changes.
      // You can use this callback to update your UI with the reader's connection status.
      onConnectionStatusChange: Logger.tracedFn(
        "onConnectionStatusChange",
        "https://stripe.com/docs/terminal/js/reference#stripeterminal-create",
        ev => {
          this.setState({ connectionStatus: ev.status, reader: null });
        }
      )
    });
    Logger.watchObject(this.client, "backend", {
      createConnectionToken: {
        docsUrl: "https://stripe.com/docs/terminal/js#connection-token"
      },
      registerDevice: {
        docsUrl: "https://stripe.com/docs/terminal/js#reader"
      },
      createPaymentIntent: {
        docsUrl: "https://stripe.com/docs/terminal/js/payment#create"
      },
      capturePaymentIntent: {
        docsUrl: "https://stripe.com/docs/terminal/js/payment#capture"
      },
      saveSourceToCustomer: {
        docsUrl: "https://stripe.com/docs/terminal/js/workflows#save-source"
      }
    });
    Logger.watchObject(this.terminal, "terminal", {
      discoverReaders: {
        docsUrl: "https://stripe.com/docs/terminal/js#reader"
      },
      connectReader: {
        docsUrl: "https://stripe.com/docs/terminal/js#reader"
      },
      disconnectReader: {
        docsUrl: "https://stripe.com/docs/terminal/js/reference#disconnect"
      },
      setReaderDisplay: {
        docsUrl:
          "https://stripe.com/docs/terminal/js/workflows#customize-the-display-during-a-payment"
      },
      collectPaymentMethod: {
        docsUrl: "https://stripe.com/docs/terminal/js/payment#confirm"
      },
      cancelCollectPaymentMethod: {
        docsUrl:
          "https://stripe.com/docs/terminal/js/reference#cancel-collect-payment-method"
      },
      confirmPaymentIntent: {
        docsUrl: "https://stripe.com/docs/terminal/js/payment#confirm"
      },
      readSource: {
        docsUrl: "https://stripe.com/docs/terminal/js/workflows#read-source"
      },
      cancelReadSource: {
        docsUrl:
          "https://stripe.com/docs/terminal/js/reference#cancel-read-source"
      }
    });
  }

  // 2. Discover and connect to a reader.
  discoverReaders = async () => {
    // 2a. Discover registered readers to connect to.
    const discoverResult = await this.terminal.discoverReaders({
      method: "registered"
    });

    if (discoverResult.error) {
      console.log("Failed to discover: ", discoverResult.error);
      return discoverResult.error;
    } else {
      this.setState({
        discoveredReaders: discoverResult.discoveredReaders
      });
      return discoverResult.discoveredReaders;
    }
  };

  connectToSimulator = async () => {
    const simulatedResult = await this.terminal.discoverReaders({
      method: "simulated"
    });
    await this.connectToReader(simulatedResult.discoveredReaders[0]);
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
    // 2c. Disconnect from the reader, in case the user wants to switch readers.
    await this.terminal.disconnectReader();
    this.setState({
      reader: null
    });
  };

  registerAndConnectNewReader = async (label, registrationCode) => {
    try {
      let reader = await this.client.registerDevice({
        label,
        registrationCode
      });
      // After registering a new reader, we can connect immediately using the reader object returned from the server.
      await this.connectToReader(reader);
      console.log("Registered and Connected Successfully!");
    } catch (e) {
      // Suppress backend errors since they will be shown in logs
    }
  };

  // 3. Terminal Workflows (Once connected to a reader)
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
    return;
  };

  // 3b. Collect a card present payment
  collectCardPayment = async () => {
    // We want to reuse the same PaymentIntent object in the case of declined charges, so we
    // store the pending PaymentIntent's secret until the payment is complete.
    if (!this.pendingPaymentIntentSecret) {
      try {
        let createIntentResponse = await this.client.createPaymentIntent({
          amount: App.CHARGE_AMOUNT,
          currency: "usd",
          description: "Test Charge"
        });
        this.pendingPaymentIntentSecret = createIntentResponse.secret;
      } catch (e) {
        // Suppress backend errors since they will be shown in logs
        return;
      }
    }
    // Read a card from the customer
    const paymentMethodPromise = this.terminal.collectPaymentMethod(
      this.pendingPaymentIntentSecret
    );
    this.setState({ cancelablePayment: true });
    const result = await paymentMethodPromise;
    if (result.error) {
      console.log("Collect payment method failed:", result.error.message);
    } else {
      const confirmResult = await this.terminal.confirmPaymentIntent(
        result.paymentIntent
      );
      // At this stage, the payment can no longer be canceled because we've sent the request to the network.
      this.setState({ cancelablePayment: false });
      if (confirmResult.error) {
        alert(`Confirm failed: ${confirmResult.error.message}`);
      } else if (confirmResult.paymentIntent) {
        try {
          // Capture the PaymentIntent from your backend client and mark the payment as complete
          let captureResult = await this.client.capturePaymentIntent({
            paymentIntentId: confirmResult.paymentIntent.id
          });
          this.pendingPaymentIntentSecret = null;
          console.log("Payment Successful!");
          return captureResult;
        } catch (e) {
          // Suppress backend errors since they will be shown in logs
          return;
        }
      }
    }
  };

  // 3c. Cancel a pending payment.
  // Note this can only be done before calling `confirmPaymentIntent`.
  cancelPendingPayment = async () => {
    await this.terminal.cancelCollectPaymentMethod();
    this.setState({ cancelablePayment: false });
  };

  // 3d. Save a card present source for re-use online.
  saveCardForFutureUse = async () => {
    // First, read a card without charging it using `readSource`
    const readSourceResult = await this.terminal.readSource();
    if (readSourceResult.error) {
      alert(`Read source failed: ${readSourceResult.error.message}`);
    } else {
      try {
        // Then, pass the source to your backend client to save it to a customer
        let customer = await this.client.saveSourceToCustomer({
          sourceId: readSourceResult.source.id
        });
        console.log("Source Saved to Customer!", customer);
        return customer;
      } catch (e) {
        // Suppress backend errors since they will be shown in logs
        return;
      }
    }
  };

  // 4. UI Methods
  onSetBackendURL = url => {
    this.initializeBackendClientAndTerminal(url);
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
          handleUseSimulator={this.connectToSimulator}
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
        <Group direction="column" spacing={30}>
          <Text size={22} color="darkGrey">
            Stripe Terminal JS Example App
          </Text>
          <Group direction="row" spacing={30} responsive>
            <Group direction="column" spacing={30} responsive>
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
        </Group>
      </div>
    );
  }
}

export default App;
