//@flow

import * as React from "react";

import Group from "../components/Group/Group.jsx";
import Text from "../components/Text/Text.jsx";
import TextInput from "../components/TextInput/TextInput.jsx";
import Select from "../components/Select/Select.jsx";

const middot = "\u00b7";
const placeholder = "xxxx xxxx xxxx xxxx".replace(/x/g, middot);
const testPaymentMethods = [
  { label: "visa", value: "visa" },
  { label: "visa_debit", value: "visa_debit" },
  { label: "mastercard", value: "mastercard" },
  { label: "mastercard_debit", value: "mastercard_debit" },
  { label: "mastercard_prepaid", value: "mastercard_prepaid" },
  { label: "amex", value: "amex" },
  { label: "amex2", value: "amex2" },
  { label: "discover", value: "discover" },
  { label: "discover2", value: "discover2" },
  { label: "diners", value: "diners" },
  { label: "diners_14digits", value: "diners_14digits" },
  { label: "jcb", value: "jcb" },
  { label: "unionpay", value: "unionpay" },
  { label: "interac", value: "interac" },

  // specific responses and errors
  { label: "refund_fail", value: "refund_fail" },
  { label: "charge_declined", value: "charge_declined" },
  {
    label: "charge_declined_insufficient_funds",
    value: "charge_declined_insufficient_funds",
  },
  { label: "charge_declined_lost_card", value: "charge_declined_lost_card" },
  {
    label: "charge_declined_stolen_card",
    value: "charge_declined_stolen_card",
  },
  {
    label: "charge_declined_expired_card",
    value: "charge_declined_expired_card",
  },
  {
    label: "charge_declined_processing_error",
    value: "charge_declined_processing_error",
  },
];

class TestPaymentMethods extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      testCardNumber: "",
      testPaymentMethod: "visa",
    };
  }

  onChangeTestCardNumber = (testCardNumber) => {
    this.setState({ testCardNumber });
    this.props.onChangeTestCardNumber(testCardNumber);
  };

  onChangeTestPaymentMethod = (testPaymentMethod) => {
    this.setState({ testPaymentMethod });
    this.props.onChangeTestPaymentMethod(testPaymentMethod);
  };

  render() {
    const { testCardNumber, testPaymentMethod } = this.state;
    return (
      <>
        <Group
          spacing={4}
          direction="row"
          alignment={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text color="dark">Test Card Number</Text>
          <TextInput
            ariaLabel="Test Card Number"
            onChange={this.onChangeTestCardNumber}
            value={testCardNumber}
            placeholder={placeholder}
            maxlength="16"
          />
        </Group>
        <Text color="dark">Test Payment Method</Text>
        <Select
          items={testPaymentMethods}
          value={testPaymentMethod}
          onChange={this.onChangeTestPaymentMethod}
        />
      </>
    );
  }
}

export default TestPaymentMethods;
