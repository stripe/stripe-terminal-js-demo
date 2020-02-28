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
      discoveryInProgress: false,
      requestInProgress: false
    };
  }

  onTriggerCancelDiscoverReaders = () => {
    this.setState({ discoveryInProgress: false });
    this.props.onClickCancelDiscover();
  }

  onTriggerDiscoverReaders = async () => {
    this.setState({
      discoveryInProgress: true,
      requestInProgress: true
    });

    try {
      await this.props.onClickDiscover();
    } finally {
      this.setState({
        discoveryInProgress: false,
        requestInProgress: false
      });
    }
  };

  onConnectToReader = reader => async () => {
    this.setState({ requestInProgress: true });
    try {
      await this.props.onConnectToReader(reader);
    } finally {
      this.setState({ requestInProgress: false });
    }
  };

  renderReaders() {
    const { readers } = this.props;
    const { requestInProgress, discoveryInProgress } = this.state;

    if (discoveryInProgress) {
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
                disabled={isOffline || requestInProgress}
                color={isOffline || requestInProgress ? "white" : "primary"}
                onClick={this.onConnectToReader(reader)}
              >
                <Text size={14} color={isOffline || requestInProgress ? "darkGrey" : "white"}>
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

  onClickUseSimulator = async () => {
    this.setState({ requestInProgress: true });
    try {
      await this.props.handleUseSimulator();
    } finally {
      this.setState({ requestInProgress: false });
    }
  };

  render() {
    const { onClickRegister } = this.props;
    const { requestInProgress, discoveryInProgress } = this.state;

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
            {
               discoveryInProgress
               ? <Button color="text" onClick={this.onTriggerCancelDiscoverReaders}>Cancel</Button>
               : <Button color="text" onClick={this.onTriggerDiscoverReaders} disabled={requestInProgress}>Discover</Button>
            }
          </Group>
        </Section>

        {this.renderReaders()}
        <Section position="last">
          <Group
            direction="row"
            alignment={{ justifyContent: "center" }}
            spacing={8}
          >
            <Button onClick={onClickRegister} disabled={requestInProgress}>
              <Text size={14} color="dark">
                Register reader
              </Text>
            </Button>
            <Button onClick={this.onClickUseSimulator} disabled={requestInProgress}>
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
