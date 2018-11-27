//@flow

import * as React from "react";

import Text from "../Text/Text.jsx";
// import { css } from "emotion";

class Link extends React.Component {
  render() {
    const { text, href } = this.props;
    return (
      <Text size={11} color="link" className={css``}>
        {text}
      </Text>
    );
  }
}

export default Link;
