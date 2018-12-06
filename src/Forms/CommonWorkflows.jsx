//@flow

import * as React from "react";

import Button from "../components/Button/Button.jsx";
import Group from "../components/Group/Group.jsx";
import Icon from "../components/Icon/Icon.jsx";
import Section from "../components/Section/Section.jsx";
import Text from "../components/Text/Text.jsx";

class CommonWorkflows extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      workFlowInProgress: null
    };
  }

  runWorkflow = async (workflowName, workflowFn) => {
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

  onRunUpdateLineItemsWorkflow = () => {
    this.runWorkflow("updateLineItems", this.props.onClickUpdateLineItems);
  };

  onRunCollectPaymentWorkflow = () => {
    this.runWorkflow("collectPayment", this.props.onClickCollectCardPayments);
  };

  onRunSaveCardWorkflow = () => {
    this.runWorkflow("collectPayment", this.props.onClickSaveCardForFutureUse);
  };

  isWorkflowDisabled = () =>
    this.props.cancelablePayment || this.state.workFlowInProgress;

  render() {
    const { onClickCancelPayment, cancelablePayment } = this.props;
    return (
      <Section>
        <Group direction="column" spacing={16}>
          <Text size={16} color="dark">
            Common workflows
          </Text>
          <Group direction="column" spacing={8}>
            <Button
              color="white"
              onClick={this.onRunUpdateLineItemsWorkflow}
              disabled={this.isWorkflowDisabled()}
            >
              <Group direction="row">
                <Icon icon="list" />
                <Text color="blue" size={14}>
                  Update line items and totals
                </Text>
              </Group>
            </Button>
            <Button
              color="white"
              onClick={this.onRunCollectPaymentWorkflow}
              disabled={this.isWorkflowDisabled()}
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
              onClick={this.onRunSaveCardWorkflow}
              disabled={this.isWorkflowDisabled()}
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
