import * as React from "react";

import { breakpoints } from "../styles.jsx";
import Button from "../components/Button/Button.jsx";
import { css } from "emotion";
import Group from "../components/Group/Group.jsx";
import Link from "../components/Link/Link.jsx";
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
      <div
        className={css`
          background: #ffffff;
          border-radius: 14px 14px 14px 14px;
          box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0);
          flex-shrink: 0;
          padding: 16px 20px;
          ${breakpoints.laptop} {
            width: 310px;
          }
          ${breakpoints.mobile} {
            width: 100%;
          }
        `}
      >
        <Group direction="column" spacing={18}>
          <Text size={16} color="dark">
            1. Clone{" "}
            <Link
              size={16}
              href="https://github.com/stripe/example-terminal-backend"
              text="example app"
              newWindow
            />
          </Text>

          <Group direction="column">
            <Text size={16} color="dark">
              2. Set backend URL
            </Text>

            <TextInput
              placeholder="http://www..."
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
      </div>
    );
  }
}

export default BackendURLForm;
