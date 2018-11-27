import * as React from "react";

import { breakpoints } from "../styles.jsx";
import { css } from "emotion";
import Group from "../lib/Group/Group.jsx";
import Text from "../lib/Text/Text.jsx";

const commonCSS = `
    background: #ffffff;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0);
    height: 44px;
    flex-shrink: 0;
    padding: 16px 20px;
    ${breakpoints.laptop} {
    width: 310px;
    }
    ${breakpoints.mobile} {
    width: 100%;
    }
    border-bottom: 1px solid #e3e8ee;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

class ConnectionInfo extends React.Component {
  render() {
    const { backendURL, reader } = this.props;

    return (
      <Group direction="column" spacing={0}>
        <div
          className={css`
            ${commonCSS}
            border-radius: 14px 14px 0 0;
          `}
        >
          {backendURL ? (
            <Text truncate color="dark">
              {backendURL}
            </Text>
          ) : (
            <Text color="lightGrey">Set backend URL</Text>
          )}
        </div>
        <div
          className={css`
            ${commonCSS}
            border-radius: 0 0 14px 14px;
          `}
        >
          {reader ? (
            <Text truncate color="dark">
              {reader}
            </Text>
          ) : (
            <Text color="lightGrey">Connect to a reader</Text>
          )}
        </div>
      </Group>
    );
  }
}

export default ConnectionInfo;
