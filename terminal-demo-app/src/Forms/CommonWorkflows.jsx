//@flow

import * as React from "react";

import Button from "../components/Button/Button.jsx";
import Group from "../components/Group/Group.jsx";
import Section from "../components/Section/Section.jsx";
import Text from "../components/Text/Text.jsx";

class CommonWorkflows extends React.Component {
  render() {
    return (
      <Section>
        <Group direction="column" spacing={12}>
          <Text size={16} color="dark">
            Common workflows
          </Text>
          <Text size={14} color="darkGrey">
            Tap a workflow to play. See all method calls and response in the
            event log.
          </Text>

          <Button color="white">
            <Text color="blue">Update line items and totals</Text>
          </Button>
          <Button color="white">
            <Text color="blue">Collect card payments</Text>
          </Button>
          <Button color="white">
            <Text color="blue">Save card for future use</Text>
          </Button>
          <Button color="white">
            <Text color="blue">Cancel payment</Text>
          </Button>
        </Group>
      </Section>
    );
  }
}

export default CommonWorkflows;
