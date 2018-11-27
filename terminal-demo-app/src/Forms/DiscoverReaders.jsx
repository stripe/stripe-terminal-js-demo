// @flow

import * as React from "react";
import Button from "../components/Button/Button.jsx";
import Group from "../components/Group/Group.jsx";
import Section from "../components/Section/Section.jsx";
import Text from "../components/Text/Text.jsx";

class DiscoverReaders extends React.Component {
  render() {
    return (
      <Group direction="column" spacing={0}>
        <Section position="first">Readers</Section>
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
