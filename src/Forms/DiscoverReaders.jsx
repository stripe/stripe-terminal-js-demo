// @flow

import * as React from "react";
import Button from "../components/Button/Button.jsx";
import Group from "../components/Group/Group.jsx";
import ReaderIcon from "../components/Icon/reader/ReaderIcon.jsx";
import Section from "../components/Section/Section.jsx";
import Text from "../components/Text/Text.jsx";

class DiscoverReaders extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      discoveryInProgress: false
    };
  }

  onTriggerDiscoverReaders = async () => {
    this.setState({ discoveryInProgress: true });
    try {
      await this.props.onClickDiscover();
    } finally {
      this.setState({ discoveryInProgress: false });
    }
  };

  onConnectToReader = reader => () => {
    this.props.onConnectToReader(reader);
  };

  renderReaders() {
    const { readers } = this.props;
    if (this.state.discoveryInProgress) {
      return (
        <Section position="middle">
          <Text size={14} color="darkGrey">
            Discovering...
          </Text>
        </Section>
      );
    } else if (readers.length >= 1) {
      return readers.map((reader, i) => {
        const isOffline = reader.status === "offline";
        return (
          <Section position="middle" key={i}>
            <Group
              direction="row"
              alignment={{
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Group direction="row">
                <ReaderIcon />
                <Group direction="column">
                  {reader.label}
                  <Group direction="row">
                    <Text size={11} color="darkGrey">
                      {reader.serial_number}
                    </Text>
                    <Text size={11} color="darkGrey">
                      {reader.ip_address}
                    </Text>
                  </Group>
                </Group>
              </Group>
              <Button
                disabled={isOffline}
                color={isOffline ? "white" : "primary"}
                onClick={this.onConnectToReader(reader)}
              >
                <Text size={14} color={isOffline ? "darkGrey" : "white"}>
                  {isOffline ? "Offline" : "Connect"}
                </Text>
              </Button>
            </Group>
          </Section>
        );
      });
    } else {
      return (
        <Section position="middle">
          <Group
            direction="column"
            spacing={12}
            alignment={{ justifyContent: "center", alignItems: "center" }}
          >
            <ReaderIcon />

            <Text color="darkGrey" size={12}>
              Register a new reader, then discover readers on your account. You
              can also use the reader simulator provided by the SDK if you don't
              have hardware.
            </Text>
          </Group>
        </Section>
      );
    }
  }

  onClickUseSimulator = () => {
    this.props.handleUseSimulator();
  };

  render() {
    const { onClickRegister } = this.props;

    return (
      <Group direction="column" spacing={0}>
        <Section position="first">
          <Group
            direction="row"
            alignment={{
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Text size={16} color="dark">
              Connect to a reader
            </Text>
            <Button color="text" onClick={this.onTriggerDiscoverReaders}>
              Discover
            </Button>
          </Group>
        </Section>

        {this.renderReaders()}
        <Section position="last">
          <Group
            direction="row"
            alignment={{ justifyContent: "center" }}
            spacing={8}
          >
            <Button onClick={onClickRegister}>
              <Text size={14} color="dark">
                Register reader
              </Text>
            </Button>
            <Button onClick={this.onClickUseSimulator}>
              <Text size={14} color="dark">
                Use simulator{" "}
              </Text>
            </Button>
          </Group>
        </Section>
      </Group>
    );
  }
}

export default DiscoverReaders;
