//@flow

import * as React from "react";

import Button from "../components/Button/Button.jsx";
import Group from "../components/Group/Group.jsx";
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
        <Group direction="column" spacing={12}>
          <Text size={16} color="dark">
            Common workflows
          </Text>

          <Button
            color="white"
            onClick={this.onRunUpdateLineItemsWorkflow}
            disabled={this.isWorkflowDisabled()}
          >
            <Text color="blue">Update line items and totals</Text>
          </Button>
          <Button
            color="white"
            onClick={this.onRunCollectPaymentWorkflow}
            disabled={this.isWorkflowDisabled()}
          >
            <Text color="blue">Collect card payment</Text>
          </Button>
          <Button
            color="white"
            onClick={this.onRunSaveCardWorkflow}
            disabled={this.isWorkflowDisabled()}
          >
            <Text color="blue">Save card for future use</Text>
          </Button>
          <Button
            color="white"
            onClick={onClickCancelPayment}
            disabled={!cancelablePayment}
          >
            <Text color="blue">Cancel payment</Text>
          </Button>
        </Group>
      </Section>
    );
  }
}

export default CommonWorkflows;
