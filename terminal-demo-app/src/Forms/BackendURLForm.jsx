import * as React from "react";

import Button from "../components/Button/Button.jsx";
import Group from "../components/Group/Group.jsx";
import Link from "../components/Link/Link.jsx";
import Section from "../components/Section/Section.jsx";
import Text from "../components/Text/Text.jsx";
import TextInput from "../components/TextInput/TextInput.jsx";

class BackendURLForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backendURL: null
    };
  }

  onClickInitialize = () => {
    this.props.onSetBackendURL(this.state.backendURL);
  };

  onChangeBackendURL = str => {
    this.setState({ backendURL: str });
  };

  render() {
    const { backendURL } = this.state;
    return (
      <Section>
        <Group direction="column" spacing={18}>
          <Text size={16} color="dark">
            1. Deploy{" "}
            <Link
              size={16}
              href="https://github.com/stripe/example-terminal-backend"
              text="example backend"
              newWindow
            />
          </Text>

          <Group direction="column">
            <Text size={16} color="dark">
              2. Set backend URL
            </Text>

            <TextInput
              placeholder="https://your-backend.herokuapp.com..."
              value={backendURL}
              onChange={this.onChangeBackendURL}
            />
            <Group
              direction="row"
              alignment={{ justifyContent: "space-between" }}
            >
              <Text size={12} color="lightGrey">
                Some info here about this backend URL.
              </Text>
              <Button
                onClick={this.onClickInitialize}
                disabled={backendURL === "" || backendURL === null}
              >
                <Text color="white" size={14}>
                  Initialize
                </Text>
              </Button>
            </Group>
          </Group>
        </Group>
      </Section>
    );
  }
}

export default BackendURLForm;
