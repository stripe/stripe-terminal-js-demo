import * as React from "react";

import "./TextInput.css";
import { css } from "emotion";

class TextInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ""
    };
  }
  handleChange = e => {
    this.setState({ value: e.target.value });
  };

  render() {
    const { value } = this.state;
    return (
      <input
        placeholder="sk_test_..."
        value={value}
        onChange={this.handleChange}
        className="TextInput"
      />
    );
  }
}

export default TextInput;
