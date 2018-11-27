// @flow

import * as React from "react";
import Button from "../components/Button/Button.jsx";
import Group from "../components/Group/Group.jsx";
import Link from "../components/Link/Link.jsx";
import Section from "../components/Section/Section.jsx";
import Text from "../components/Text/Text.jsx";

class DiscoverReaders extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      readers: []
    };
  }

  renderReaders() {
    const { readers } = this.state;
    if (readers.length >= 1) {
      return readers.map(reader => {
        return null;
      });
    } else {
      return (
        <Section position="middle" alignment={{ justifyContent: "center" }}>
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
  render() {
    return (
      <Group direction="column" spacing={0}>
        <Section
          position="first"
          alignment={{ justifyContent: "space-between" }}
        >
          <Text size={16} color="dark">
            Readers
          </Text>
          <Button>
            <Text>Reload</Text>
          </Button>
        </Section>

        {this.renderReaders()}
        <Section position="last">
          <Button color="white">
            <Text color="dark">Register new reader</Text>
          </Button>
          <Button color="white">
            <Text color="dark" size={14}>
              Use simulator
            </Text>
          </Button>
        </Section>
      </Group>
    );
  }
}

export default DiscoverReaders;
