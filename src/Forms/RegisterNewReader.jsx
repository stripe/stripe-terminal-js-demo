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

  onSubmitRegister = (event) => {
    event.preventDefault();
    const { readerCode, readerLabel } = this.state;
    this.props.onSubmitRegister(readerLabel, readerCode);
  };

  render() {
    const { readerCode, readerLabel } = this.state;
    const { onClickCancel } = this.props;
    return (
      <Section>
        <form onSubmit={this.onSubmitRegister}>
          <Group direction="column" spacing={16}>
            <Group direction="column" spacing={8}>
              <Text size={16} color="dark">
                Register new reader
              </Text>
              <Text size={12} color="lightGrey">
                Enter the key sequence 0-7-1-3-9 on the reader to display its
                unique registration code.
              </Text>
            </Group>
            <Group direction="column" spacing={8}>
              <Text size={14} color="darkGrey">
                Registration code
              </Text>
              <TextInput
                placeholder="quick-brown-fox"
                value={readerCode}
                onChange={this.onChangeReaderCode}
                ariaLabel="Registration code"
              />
              <Text size={14} color="darkGrey">
                Reader label
              </Text>
              <TextInput
                placeholder="Front desk"
                value={readerLabel}
                onChange={this.onChangeReaderLabel}
                ariaLabel="Reader label"
              />
            </Group>
            <Group direction="row" alignment={{ justifyContent: "flex-end" }}>
              <Button color="white" onClick={onClickCancel}>
                <Text color="darkGrey" size={14}>
                  Cancel
                </Text>
              </Button>
              <Button
                type="submit"
                disabled={
                  readerCode === null ||
                  readerCode === "" ||
                  readerLabel === null ||
                  readerCode === ""
                }
                color="primary"
              >
                <Text color="white" size={14}>
                  Register
                </Text>
              </Button>
            </Group>
          </Group>
        </form>
      </Section>
    );
  }
}

export default RegisterNewReader;
