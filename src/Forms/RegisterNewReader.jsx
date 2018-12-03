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
    const { readerCode, readerLabel } = this.state;
    this.props.onClickRegister(readerLabel, readerCode);
  };

  render() {
    const { readerCode, readerLabel } = this.state;
    const { onClickCancel } = this.props;
    return (
      <Section>
        <Group direction="column" spacing={8}>
          <Text size={16} color="dark">
            Register new reader
          </Text>
          <Text size={12} color="lightGrey">
            Before connecting to a reader for the first time, you'll need to
            register the device. Enter the key sequence 0-7-1-3-9 on the reader
            to display its unique registration code.
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
            <Button color="white" onClick={onClickCancel}>
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
