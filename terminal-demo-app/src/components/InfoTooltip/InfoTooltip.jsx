import * as React from "react";
import "./InfoTooltip.css";
import { css } from "emotion";

import Text from "../Text/Text.jsx";

class InfoTooltip extends React.Component {
  render() {
    const { text } = this.props;
    return (
      <div className="InfoTooltip">
        &#9432;
        <span className="InfoTooltipText">
          <div
            className={css`
              background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMSIgaGVpZ2h0PSI5IiB2aWV3Qm94PSIwIDAgMjEgOSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjODg5OEFBIiBmaWxsLW9wYWNpdHk9Ii4xIiBkPSJNMSA5LjA5MmgxOWwtNi40MDItNi43NGMtMS43MTctMS44MDYtNC40ODUtMS44LTYuMTk2IDBMMSA5LjA5M3pNMjAuMzQyIDhsLTYuMDItNi4zMzZjLTIuMTA4LTIuMjItNS41MzgtMi4yMTgtNy42NDUgMEwuNjU4IDhoMTkuNjg0eiIvPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik03LjQwMiAyLjM1M2MxLjcxMS0xLjgwMSA0LjQ4LTEuODA3IDYuMTk2IDBMMjAgOS4wOTNIMWw2LjQwMi02Ljc0eiIvPjwvZz48L3N2Zz4=")
                no-repeat;
              height: 21px;
              width: 21px;
              background-position: center center;
              z-index: 301;
              transform: translatey(-24px) translatex(75px);
              position: absolute;
            `}
          />
          <Text color="darkGrey">{text}</Text>
        </span>
      </div>
    );
  }
}

export default InfoTooltip;
