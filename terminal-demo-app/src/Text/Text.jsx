// @flow

import * as React from "react";

import "./Text.css";

class Text extends React.Component {
  render() {
    const { children } = this.props;
    return <span className="Text">{children}</span>;
  }
}

export default Text;
