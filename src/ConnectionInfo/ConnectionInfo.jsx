import * as React from "react";

import Button from "../components/Button/Button.jsx";
import Group from "../components/Group/Group.jsx";
import Icon from "../components/Icon/icon.jsx";
import Section from "../components/Section/Section.jsx";
import Text from "../components/Text/Text.jsx";

class ConnectionInfo extends React.Component {
  onChangeBackendURL = () => {
    this.props.onClickDisconnect();
    this.props.onSetBackendURL(null);
  };

  render() {
    const { backendURL, reader, onClickDisconnect } = this.props;

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
              <Group direction="row">
                <Icon icon="lock" />
                <Text truncate nowrap color="dark" size={14}>
                  {backendURL}
                </Text>
              </Group>
              <Button color="white" onClick={this.onChangeBackendURL}>
                <Text nowrap color="dark">
                  Change URL
                </Text>
              </Button>
            </Group>
          ) : (
            <Text color="lightGrey" size={14}>
              Set backend URL
            </Text>
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
              <Text truncate color="dark" size={14}>
                {reader.label}
              </Text>
              <Button color="white" onClick={onClickDisconnect}>
                <Text color="dark">Disconnect</Text>
              </Button>
            </Group>
          ) : (
            <Text color="lightGrey" size={14}>
              Connect to a reader
            </Text>
          )}
        </Section>
      </Group>
    );
  }
}

export default ConnectionInfo;
