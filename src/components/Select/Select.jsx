import * as React from "react";

import "./Select.css";

class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.value };
  }

  onChange = (e) => {
    this.setState({ value: e.target.value });
    this.props.onChange(e.target.value);
  };

  render() {
    const items = this.props.items.map((item, index) => (
      <option key={index} value={item.value}>
        {item.label}
      </option>
    ));

    return <select required={this.props.required} className="Select" value={this.state.value} onChange={this.onChange}>
        {items}
      </select>;
  }
}

export default Select;
