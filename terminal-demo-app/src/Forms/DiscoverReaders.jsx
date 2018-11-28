// @flow

import * as React from "react";
import Button from "../components/Button/Button.jsx";
import Group from "../components/Group/Group.jsx";
import ReaderIcon from "../components/Icon/reader/ReaderIcon.jsx";
import Section from "../components/Section/Section.jsx";
import Text from "../components/Text/Text.jsx";

class DiscoverReaders extends React.Component {
  renderReaders() {
    const { readers } = this.props;
    if (readers.length >= 1) {
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
                color={isOffline ? "white" : "default"}
                onClick={this.onSetReader(reader)}
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
            alignment={{ justifyContent: "center" }}
          >
            <Text color="darkGrey">No reader registered</Text>
          </Group>
        </Section>
      );
    }
  }

  onSetReader = label => () => {
    this.props.onSetReader(label);
  };

  onClickUseSimulator = () => {
    this.props.handleUseSimulator();
  };

  render() {
    const { onClickDiscover, onClickRegister } = this.props;

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
              Readers
            </Text>
            <Button color="white" onClick={onClickDiscover}>
              <Text color="dark">Discover</Text>
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
            <Button color="white" onClick={onClickRegister}>
              <Text color="dark">Register new reader</Text>
            </Button>
            <Button color="white" onClick={this.onClickUseSimulator}>
              <Text color="dark" size={14}>
                Use simulator
              </Text>
            </Button>
          </Group>
        </Section>
      </Group>
    );
  }
}

export default DiscoverReaders;
