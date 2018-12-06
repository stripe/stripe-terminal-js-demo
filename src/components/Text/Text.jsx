// @flow

import * as React from "react";

import { css } from "emotion";

class Text extends React.Component {
  getColor = color => {
    switch (color) {
      case "blue":
        return "#586ADA";
      case "dark":
        return "#3B415E";
      case "grey":
        return "#C1C9D2";
      case "lightGrey":
        return "#8792A2";
      case "darkGrey":
        return "#697386";
      case "link":
        return "#586ADA";
      case "white":
        return "#FFFFFF";
      case "code":
        return "#D7ECFF";
      default:
        return "#E3E8EE";
    }
  };

  render() {
    const { children, color, size, truncate, nowrap } = this.props;
    return (
      <div
        className={css`
          line-height: 16px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Ubuntu;
          font-weight: 500;
          letter-spacing: -0.15px;
          -webkit-font-smoothing: antialiased;

          overflow: ${truncate ? "hidden" : "inherit"};
          text-overflow: ${truncate ? "ellipsis" : "inherit"};
          white-space: ${nowrap ? "nowrap" : "inherit"};
          display: ${truncate ? "block" : "inline"};
        `}
        style={{ fontSize: size || 12, color: this.getColor(color) }}
      >
        {children}
      </div>
    );
  }
}

export default Text;
