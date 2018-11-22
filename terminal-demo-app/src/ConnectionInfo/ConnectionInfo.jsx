import * as React from "react";

import { breakpoints } from "../styles.jsx";
import { css } from "emotion";
import Group from "../lib/Group/Group.jsx";

class ConnectionInfo extends React.Component {
  render() {
    return (
      <Group direction="column" spacing={0}>
        <div
          className={css`
            background: #ffffff;
            border-radius: 14px 14px 0 0;
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
          `}
        >
          hello
        </div>
        <div
          className={css`
            background: #ffffff;
            border-radius: 0 0 14px 14px;
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
          `}
        >
          hello
        </div>
      </Group>
    );
  }
}

export default ConnectionInfo;
