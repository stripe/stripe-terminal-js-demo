import * as React from "react";

import Button from "../components/Button/Button.jsx";
import Group from "../components/Group/Group.jsx";
import Section from "../components/Section/Section.jsx";
import Text from "../components/Text/Text.jsx";

class ConnectionInfo extends React.Component {
  onDisconnectReader = () => {
    this.props.onSetReader(null);
  };

  onChangeBackendURL = () => {
    this.props.onSetReader(null);
    this.props.onSetBackendURL(null);
  };

  render() {
    const { backendURL, reader } = this.props;
    console.log("READER");
    console.log(reader);

    return (
      <Group direction="column" spacing={0}>
        <Section position="first">
          {backendURL ? (
            <Group
              direction="row"
              alignment={{
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Text truncate color="dark">
                {backendURL}
              </Text>
              <Button color="white" onClick={this.onChangeBackendURL}>
                <Text color="dark">Change URL</Text>
              </Button>
            </Group>
          ) : (
            <Text color="lightGrey">Set backend URL</Text>
          )}
        </Section>
        <Section position="last">
          {reader ? (
            <Group
              direction="row"
              alignment={{
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Text truncate color="dark">
                {reader.label}
              </Text>
              <Button color="white" onClick={this.onDisconnectReader}>
                <Text color="dark">Disconnect</Text>
              </Button>
            </Group>
          ) : (
            <Text color="lightGrey">Connect to a reader</Text>
          )}
        </Section>
      </Group>
    );
  }
}

export default ConnectionInfo;
