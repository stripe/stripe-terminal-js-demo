import * as React from "react";

import Group from "../components/Group/Group.jsx";
import Section from "../components/Section/Section.jsx";
import Text from "../components/Text/Text.jsx";

class ConnectionInfo extends React.Component {
  render() {
    const { backendURL, reader } = this.props;

    return (
      <Group direction="column" spacing={0}>
        <Section position="first">
          {backendURL ? (
            <Text truncate color="dark">
              {backendURL}
            </Text>
          ) : (
            <Text color="lightGrey">Set backend URL</Text>
          )}
        </Section>
        <Section position="last">
          {reader ? (
            <Text truncate color="dark">
              {reader}
            </Text>
          ) : (
            <Text color="lightGrey">Connect to a reader</Text>
          )}
        </Section>
      </Group>
    );
  }
}

export default ConnectionInfo;
