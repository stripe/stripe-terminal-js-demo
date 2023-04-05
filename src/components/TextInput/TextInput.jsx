import * as React from "react";

import "./TextInput.css";

class TextInput extends React.Component {
  onChange = (e) => {
    this.props.onChange(e.target.value);
  };

  render() {
    const {
      placeholder,
      value,
      ariaLabel,
      maxlength,
      type,
      min,
      step,
    } = this.props;
    return (
      <input
        placeholder={placeholder}
        value={value || ""}
        onChange={this.onChange}
        className="TextInput"
        aria-label={ariaLabel || ""}
        maxlength={maxlength || ""}
        type={type || "text"}
        min={min || ""}
        step={step || ""}
      />
    );
  }
}

export default TextInput;
