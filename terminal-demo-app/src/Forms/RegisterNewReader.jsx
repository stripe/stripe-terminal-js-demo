//@flow

import * as React from "react";

import Button from "../components/Button/Button.jsx";
import Group from "../components/Group/Group.jsx";
import Section from "../components/Section/Section.jsx";
import Text from "../components/Text/Text.jsx";
import TextInput from "../components/TextInput/TextInput.jsx";

class RegisterNewReader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      readerCode: null,
      readerLabel: null
    };
  }

  onChangeReaderCode = str => {
    this.setState({ readerCode: str });
  };

  onChangeReaderLabel = str => {
    this.setState({ readerLabel: str });
  };

  onClickRegister = () => {
    const { readerLabel } = this.state;
    this.props.onSetReader(readerLabel);
  };

  render() {
    const { readerCode, readerLabel } = this.state;
    return (
      <Section>
        <Group direction="column" spacing={8}>
          <Text size={16} color="dark">
            Register new reader
          </Text>
          <TextInput
            placeholder="Reader code"
            value={readerCode}
            onChange={this.onChangeReaderCode}
          />
          <TextInput
            placeholder="Reader label"
            value={readerLabel}
            onChange={this.onChangeReaderLabel}
          />
          <Group direction="row" alignment={{ justifyContent: "flex-end" }}>
            <Button color="white">
              <Text color="darkGrey" size={14}>
                Cancel
              </Text>
            </Button>
            <Button
              onClick={this.onClickRegister}
              disabled={
                readerCode === null ||
                readerCode === "" ||
                readerLabel === null ||
                readerCode === ""
              }
            >
              <Text color="white" size={14}>
                Register
              </Text>
            </Button>
          </Group>
        </Group>
      </Section>
    );
  }
}

export default RegisterNewReader;
