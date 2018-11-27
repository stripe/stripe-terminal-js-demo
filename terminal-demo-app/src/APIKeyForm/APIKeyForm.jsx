import * as React from "react";

import { breakpoints } from "../styles.jsx";
import Button from "../lib/Button/Button.jsx";
import { css } from "emotion";
import Group from "../lib/Group/Group.jsx";
import Text from "../lib/Text/Text.jsx";
import TextInput from "../lib/TextInput/TextInput.jsx";

class APIKeyForm extends React.Component {
  render() {
    return (
      <div
        className={css`
          background: #ffffff;
          border-radius: 14px 14px 14px 14px;
          box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0);
          height: 146px;
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
        <Group direction="column">
          <Group
            direction="row"
            alignment={{ justifyContent: "space-between" }}
          >
            <Text size={16} color="dark">
              Set backend URL
            </Text>
            <Text size={14} color="blue">
              Open dashboard
            </Text>
          </Group>
          <TextInput />
          <Group
            direction="row"
            alignment={{ justifyContent: "space-between" }}
          >
            <Text size={12} color="lightGrey">
              The key will only be used for local testing and will not be
              shared.
            </Text>
            <Button>
              <Text color="white" size={14}>
                Initialize
              </Text>
            </Button>
          </Group>
        </Group>
      </div>
    );
  }
}

export default APIKeyForm;
