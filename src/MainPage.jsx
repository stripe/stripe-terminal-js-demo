import React, { Component } from "react";

import Client from "./client";
import Logger from "./logger";

import BackendURLForm from "./Forms/BackendURLForm.jsx";
import CommonWorkflows from "./Forms/CommonWorkflows.jsx";
import RefundForm from "./Forms/RefundForm.jsx";
import CartForm from "./Forms/CartForm.jsx";
import ConnectionInfo from "./ConnectionInfo/ConnectionInfo.jsx";
import Readers from "./Forms/Readers.jsx";
import Group from "./components/Group/Group.jsx";
import Logs from "./Logs/Logs.jsx";

import { css } from "emotion";

class App extends Component {
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
      chargeAmount: 5100,
      itemDescription: "Red t-shirt",
      taxAmount: 100,
      currency: "usd",
      workFlowInProgress: null,
      disoveryWasCancelled: false,
      refundedChargeID: null,
      refundedAmount: null,
      cancelableRefund: false,
      usingSimulator: false,
      testCardNumber: "",
      testPaymentMethod: "visa",
    };
  }

  isWorkflowDisabled = () =>
    this.state.cancelablePayment || this.state.workFlowInProgress;

  runWorkflow = async (workflowName, workflowFn) => {
    console.log(workflowName, workflowFn);
    this.setState({
      workFlowInProgress: workflowName
    });
    try {
      await workflowFn();
    } finally {
      this.setState({
        workFlowInProgress: null
      });
    }
  };

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
        "https://stripe.com/docs/terminal/js-api-reference#stripeterminal-create",
        () => {
          alert("Unexpected disconnect from the reader");
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
        "https://stripe.com/docs/terminal/js-api-reference#stripeterminal-create",
        ev => {
          this.setState({ connectionStatus: ev.status, reader: null });
        }
      )
    });
    Logger.watchObject(this.client, "backend", {
      createConnectionToken: {
        docsUrl: "https://stripe.com/docs/terminal/sdk/js#connection-token"
      },
      registerDevice: {
        docsUrl:
          "https://stripe.com/docs/terminal/readers/connecting/verifone-p400#register-reader"
      },
      createPaymentIntent: {
        docsUrl: "https://stripe.com/docs/terminal/payments#create"
      },
      capturePaymentIntent: {
        docsUrl: "https://stripe.com/docs/terminal/payments#capture"
      },
      savePaymentMethodToCustomer: {
        docsUrl: "https://stripe.com/docs/terminal/payments/saving-cards"
      }
    });
    Logger.watchObject(this.terminal, "terminal", {
      discoverReaders: {
        docsUrl:
          "https://stripe.com/docs/terminal/js-api-reference#discover-readers"
      },
      connectReader: {
        docsUrl: "https://stripe.com/docs/terminal/js-api-reference#connect-reader"
      },
      disconnectReader: {
        docsUrl: "https://stripe.com/docs/terminal/js-api-reference#disconnect"
      },
      setReaderDisplay: {
        docsUrl:
          "https://stripe.com/docs/terminal/js-api-reference#set-reader-display"
      },
      collectPaymentMethod: {
        docsUrl:
          "https://stripe.com/docs/terminal/js-api-reference#collect-payment-method"
      },
      cancelCollectPaymentMethod: {
        docsUrl:
          "https://stripe.com/docs/terminal/js-api-reference#cancel-collect-payment-method"
      },
      processPayment: {
        docsUrl:
          "https://stripe.com/docs/terminal/js-api-reference#process-payment"
      },
      readReusableCard: {
        docsUrl:
          "https://stripe.com/docs/terminal/js-api-reference#read-reusable-card"
      },
      cancelReadReusableCard: {
        docsUrl:
          "https://stripe.com/docs/terminal/js-api-reference#cancel-read-reusable-card"
      },
      collectRefundPaymentMethod: {
        docsUrl: "https://stripe.com/docs/terminal/js-api-reference#stripeterminal-collectrefundpaymentmethod"
      },
      processRefund: {
        docsUrl: "https://stripe.com/docs/terminal/js-api-reference#stripeterminal-processrefund"
      },
      cancelCollectRefundPaymentMethod: {
        docsUrl: "https://stripe.com/docs/terminal/js-api-reference#stripeterminal-cancelcollectrefundpaymentmethod"
      }
    });
  }

  // 2. Discover and connect to a reader.
  discoverReaders = async () => {
    this.setState({
      discoveryWasCancelled: false
    });

    // 2a. Discover registered readers to connect to.
    const discoverResult = await this.terminal.discoverReaders();

    if (discoverResult.error) {
      console.log("Failed to discover: ", discoverResult.error);
      return discoverResult.error;
    } else {
      if (this.state.discoveryWasCancelled) return;

      this.setState({
        discoveredReaders: discoverResult.discoveredReaders
      });
      return discoverResult.discoveredReaders;
    }
  };

  cancelDiscoverReaders = () => {
    this.setState({
      discoveryWasCancelled: true,
    });
  };

  connectToSimulator = async () => {
    const simulatedResult = await this.terminal.discoverReaders({
      simulated: true,
    });
    await this.connectToReader(simulatedResult.discoveredReaders[0]);
  };

  connectToReader = async (selectedReader) => {
    // 2b. Connect to a discovered reader.
    const connectResult = await this.terminal.connectReader(selectedReader);
    if (connectResult.error) {
      console.log("Failed to connect:", connectResult.error);
    } else {
      this.setState({
        usingSimulator: selectedReader.id === "SIMULATOR",
        status: "workflows",
        discoveredReaders: [],
        reader: connectResult.reader,
      });
      return connectResult;
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
        line_items: [
          {
            description: this.state.itemDescription,
            amount: this.state.chargeAmount,
            quantity: 1
          }
        ],
        tax: this.state.taxAmount,
        total: this.state.chargeAmount + this.state.taxAmount,
        currency: this.state.currency
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
        let paymentMethodTypes = ["card_present"];
        if (this.state.currency === "cad") {
          paymentMethodTypes.push("interac_present");
        }
        let createIntentResponse = await this.client.createPaymentIntent({
          amount: this.state.chargeAmount + this.state.taxAmount,
          currency: this.state.currency,
          description: "Test Charge",
          paymentMethodTypes
        });
        this.pendingPaymentIntentSecret = createIntentResponse.secret;
      } catch (e) {
        // Suppress backend errors since they will be shown in logs
        return;
      }
    }
    // Read a card from the customer
    this.terminal.setSimulatorConfiguration({
      testPaymentMethod: this.state.testPaymentMethod,
      testCardNumber: this.state.testCardNumber,
    });
    const paymentMethodPromise = this.terminal.collectPaymentMethod(
      this.pendingPaymentIntentSecret
    );
    this.setState({ cancelablePayment: true });
    const result = await paymentMethodPromise;
    if (result.error) {
      console.log("Collect payment method failed:", result.error.message);
    } else {
      const confirmResult = await this.terminal.processPayment(
        result.paymentIntent
      );
      // At this stage, the payment can no longer be canceled because we've sent the request to the network.
      this.setState({ cancelablePayment: false });
      if (confirmResult.error) {
        alert(`Confirm failed: ${confirmResult.error.message}`);
      } else if (confirmResult.paymentIntent) {
        if (confirmResult.paymentIntent.status !== "succeeded") {
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
        } else {
          this.pendingPaymentIntentSecret = null;
          console.log("Single-message payment successful!");
          return confirmResult;
        }
      }
    }
  };

  // 3c. Cancel a pending payment.
  // Note this can only be done before calling `processPayment`.
  cancelPendingPayment = async () => {
    await this.terminal.cancelCollectPaymentMethod();
    this.pendingPaymentIntentSecret = null;
    this.setState({ cancelablePayment: false });
  };

  // 3d. Save a card for re-use online.
  saveCardForFutureUse = async () => {
    // First, read a card without charging it using `readReusableCard`
    const readResult = await this.terminal.readReusableCard();
    if (readResult.error) {
      alert(`readReusableCard failed: ${readResult.error.message}`);
    } else {
      try {
        // Then, pass the payment method to your backend client to save it to a customer
        let customer = await this.client.savePaymentMethodToCustomer({
          paymentMethodId: readResult.payment_method.id
        });
        console.log("Payment method saved to customer!", customer);
        return customer;
      } catch (e) {
        // Suppress backend errors since they will be shown in logs
        return;
      }
    }
  };

  // 3e. collectRefundPaymentMethod
  collectRefundPaymentMethod = async () => {
    this.setState({ cancelableRefund: true });
    const readResult = await this.terminal.collectRefundPaymentMethod(
      this.state.refundedChargeID,
      this.state.refundedAmount,
      "cad"
    );
    if (readResult.error) {
      alert(`collectRefundPaymentMethod failed: ${readResult.error.message}`);
    } else {
      const refund = await this.terminal.processRefund();
      if (refund.error) {
        alert(`processRefund failed: ${refund.error.message}`);
      } else {
        console.log("Charge fully refunded!");
        this.setState({
          cancelableRefund: false,
          refundedAmount: null,
          refundedChargeID: null
        });
        return refund;
      }
    }
    this.setState({ cancelableRefund: false });
  };

  // 3f. cancelCollectRefundPaymentMethod
  cancelPendingRefund = async () => {
    await this.terminal.cancelCollectRefundPaymentMethod();
    this.setState({
      cancelableRefund: false,
      refundedAmount: null,
      refundedChargeID: null
    });
  };

  // 4. UI Methods
  onSetBackendURL = url => {
    if (url !== null) {
      window.localStorage.setItem("terminal.backendUrl", url);
    } else {
      window.localStorage.removeItem("terminal.backendUrl");
    }
    this.initializeBackendClientAndTerminal(url);
    this.setState({ backendURL: url });
  };
  updateChargeAmount = amount =>
    this.setState({ chargeAmount: parseInt(amount, 10) });
  updateItemDescription = description =>
    this.setState({ itemDescription: description });
  updateTaxAmount = amount =>
    this.setState({ taxAmount: parseInt(amount, 10) });
  updateCurrency = currency => this.setState({ currency: currency });
  updateRefundChargeID = id => this.setState({ refundedChargeID: id });
  updateRefundAmount = amount => {
    this.setState({ refundedAmount: parseInt(amount, 10) });
  };

  onChangeTestPaymentMethod = (testPaymentMethod) => {
    this.setState({ testPaymentMethod });
  };

  onChangeTestCardNumber = (testCardNumber) => {
    this.setState({ testCardNumber });
  };

  renderForm() {
    const {
      backendURL,
      cancelablePayment,
      reader,
      discoveredReaders,
      usingSimulator,
    } = this.state;
    if (backendURL === null && reader === null) {
      return <BackendURLForm onSetBackendURL={this.onSetBackendURL} />;
    } else if (reader === null) {
      return (
        <Readers
          onClickDiscover={() => this.discoverReaders()}
          onClickCancelDiscover={() => this.cancelDiscoverReaders()}
          onSubmitRegister={this.registerAndConnectNewReader}
          readers={discoveredReaders}
          onConnectToReader={this.connectToReader}
          handleUseSimulator={this.connectToSimulator}
        />
      );
    } else {
      return (
        <>
          <CommonWorkflows
            workFlowDisabled={this.isWorkflowDisabled()}
            onClickCollectCardPayments={() =>
              this.runWorkflow("collectPayment", this.collectCardPayment)
            }
            onClickSaveCardForFutureUse={() =>
              this.runWorkflow("saveCard", this.saveCardForFutureUse)
            }
            onClickCancelPayment={this.cancelPendingPayment}
            onChangeTestPaymentMethod={this.onChangeTestPaymentMethod}
            onChangeTestCardNumber={this.onChangeTestCardNumber}
            cancelablePayment={cancelablePayment}
            usingSimulator={usingSimulator}
          />
          <RefundForm
            onClickProcessRefund={() =>
              this.runWorkflow("collectRefund", this.collectRefundPaymentMethod)
            }
            chargeID={this.state.refundedChargeID}
            onChangeChargeID={id => this.updateRefundChargeID(id)}
            refundAmount={this.state.refundedAmount}
            onChangeRefundAmount={amt => this.updateRefundAmount(amt)}
            cancelableRefund={this.state.cancelableRefund}
            onClickCancelRefund={() =>
              this.runWorkflow("cancelRefund", this.cancelPendingRefund)
            }
          />
          <CartForm
            workFlowDisabled={this.isWorkflowDisabled()}
            onClickUpdateLineItems={() =>
              this.runWorkflow("updateLineItems", this.updateLineItems)
            }
            itemDescription={this.state.itemDescription}
            chargeAmount={this.state.chargeAmount}
            taxAmount={this.state.taxAmount}
            currency={this.state.currency}
            onChangeCurrency={currency => this.updateCurrency(currency)}
            onChangeChargeAmount={amount => this.updateChargeAmount(amount)}
            onChangeTaxAmount={amount => this.updateTaxAmount(amount)}
            onChangeItemDescription={description =>
              this.updateItemDescription(description)
            }
          />
        </>
      );
    }
  }

  render() {
    const { backendURL, reader } = this.state;
    return (
      <div
        className={css`
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          padding: 24px;
          @media (max-width: 800px) {
            height: auto;
            padding: 24px;
          }
        `}
      >
        <Group direction="column" spacing={30}>
          <Group direction="row" spacing={30} responsive>
            <Group direction="column" spacing={16} responsive>
              {backendURL && (
                <ConnectionInfo
                  backendURL={backendURL}
                  reader={reader}
                  onSetBackendURL={this.onSetBackendURL}
                  onClickDisconnect={this.disconnectReader}
                />
              )}

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
