//@flow

import * as React from "react";

import { css } from "emotion";
import Text from "../Text/Text.jsx";

class OverflowMenuItem extends React.Component {
  onClick = () => {
    if (this.props.onClick) {
      this.props.onClick();
    }
  };

  render() {
    const { children } = this.props;
    return (
      <div
        className={css`
          display: block;
          padding: 8px;
          white-space: nowrap;
          min-width: 160px;
        `}
        onClick={this.onClick}
      >
        <Text color="blue">{children}</Text>
      </div>
    );
  }
}

export default OverflowMenuItem;
