//@flow

import * as React from "react";

import Button from "../components/Button/Button.jsx";
import Group from "../components/Group/Group.jsx";
import Icon from "../components/Icon/Icon.jsx";
import Section from "../components/Section/Section.jsx";
import Text from "../components/Text/Text.jsx";
import TestPaymentMethods from "./TestPaymentMethods.jsx";

class CommonWorkflows extends React.Component {
  render() {
    const {
      onClickCancelPayment,
      onChangeTestCardNumber,
      onChangeTestPaymentMethod,
      cancelablePayment,
      workFlowDisabled,
      usingSimulator,
    } = this.props;
    return (
      <Section>
        <Group direction="column" spacing={16}>
          <Text size={16} color="dark">
            Common workflows
          </Text>
          <Group direction="column" spacing={8}>
            {usingSimulator && (
              <TestPaymentMethods
                onChangeTestCardNumber={onChangeTestCardNumber}
                onChangeTestPaymentMethod={onChangeTestPaymentMethod}
              />
            )}
            <Button
              color="white"
              onClick={this.props.onClickCollectCardPayments}
              disabled={workFlowDisabled}
              justifyContent="left"
            >
              <Group direction="row">
                <Icon icon="payments" />
                <Text color="blue" size={14}>
                  Collect card payment
                </Text>
              </Group>
            </Button>
            <Button
              color="white"
              onClick={this.props.onClickSaveCardForFutureUse}
              disabled={workFlowDisabled}
              justifyContent="left"
            >
              <Group direction="row">
                <Icon icon="card" />
                <Text color="blue" size={14}>
                  Save card for future use
                </Text>
              </Group>
            </Button>
            <Button
              color="white"
              onClick={onClickCancelPayment}
              disabled={!cancelablePayment}
              justifyContent="left"
            >
              <Group direction="row">
                <Icon icon="cancel" />
                <Text color="blue" size={14}>
                  Cancel payment
                </Text>
              </Group>
            </Button>
          </Group>
        </Group>
      </Section>
    );
  }
}

export default CommonWorkflows;
