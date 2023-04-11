import * as React from "react";

import "./CheckBox.css";

class CheckBox extends React.Component {
  onChange = (e) => {
    this.props.onChange(e.target.checked);
  };

  render() {
    const { ariaLabel, value } = this.props;
    return (
      <input
        value={value || false}
        onChange={this.onChange}
        className="CheckBox"
        aria-label={ariaLabel || ""}
        type={"checkbox"}
      />
    );
  }
}

export default CheckBox;
