//@flow

import * as React from "react";

import Text from "../Text/Text.jsx";
import { css } from "emotion";

class Link extends React.Component {
  render() {
    const { text, href, size, newWindow = false } = this.props;
    return (
      <a href={href} target={newWindow ? "_blank" : ""}>
        <Text size={size} color="link" className={css``}>
          {text}
        </Text>
      </a>
    );
  }
}

export default Link;
