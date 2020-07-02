//@flow

import * as React from "react";

import Group from "../components/Group/Group.jsx";
import TextInput from "../components/TextInput/TextInput.jsx";

const middot = "\u00b7";
const placeholder = "xxxx xxxx xxxx xxxx".replace(/x/g, middot);

class TestPaymentMethods extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      testCardNumber: "",
    };
  }

  onChangeTestCardNumber = (testCardNumber) => {
    this.setState({ testCardNumber: testCardNumber });
    this.props.onChangeTestCardNumber(testCardNumber);
  };

  render() {
    const { testCardNumber } = this.state;
    return (
      <Group spacing={4}>
        <TextInput
          ariaLabel="Test Card Number"
          onChange={this.onChangeTestCardNumber}
          value={testCardNumber}
          placeholder={placeholder}
          maxlength="16"
        />
      </Group>
    );
  }
}

export default TestPaymentMethods;
