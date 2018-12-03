import * as React from "react";

import "./TextInput.css";

class TextInput extends React.Component {
  onChange = e => {
    this.props.onChange(e.target.value);
  };

  render() {
    const { placeholder, value } = this.props;
    return (
      <input
        placeholder={placeholder}
        value={value || ""}
        onChange={this.onChange}
        className="TextInput"
      />
    );
  }
}

export default TextInput;
