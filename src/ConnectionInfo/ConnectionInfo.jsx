import * as React from "react";

import { css } from "emotion";

import Button from "../components/Button/Button.jsx";
import Group from "../components/Group/Group.jsx";
import Icon from "../components/Icon/Icon.jsx";
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
                <div
                  className={css`
                    width: 130px;
                  `}
                >
                  <Text truncate nowrap color="dark" size={14}>
                    {backendURL}
                  </Text>
                </div>
              </Group>
              <Button color="text" onClick={this.onChangeBackendURL}>
                Change
              </Button>
            </Group>
          ) : (
            <Group direction="row">
              <Icon icon="lock" />
              <Text color="lightGrey" size={14}>
                Connect to backend server
              </Text>
            </Group>
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
              <Group direction="row">
                <Icon icon="keypad" />
                <Text truncate color="dark" size={14}>
                  {reader.label}
                </Text>
              </Group>
              <Button color="text" onClick={onClickDisconnect}>
                Disconnect
              </Button>
            </Group>
          ) : (
            <Group direction="row">
              <Icon icon="keypad" />
              <Text color="lightGrey" size={14}>
                No reader connected
              </Text>
            </Group>
          )}
        </Section>
      </Group>
    );
  }
}

export default ConnectionInfo;
