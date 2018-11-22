//@flow

import * as React from "react";

import "./Group.css";

class Group extends React.Component {
  getMarginStyle = (direction, spacing, first = false) => {
    switch (direction) {
      case "column":
        return { marginTop: first ? -spacing : spacing };
      case "row":
        return { marginLeft: first ? -spacing : spacing };
      default:
        return {};
    }
  };

  render() {
    const { alignment, children, direction, spacing } = this.props;

    return (
      <div
        className="Group"
        style={{
          flexDirection: direction,
          ...this.getMarginStyle(direction, spacing, true),
          ...alignment
        }}
      >
        {children.map((child, i) => {
          return (
            <div
              className="Group-children"
              style={{
                ...this.getMarginStyle(direction, spacing),
                ...alignment
              }}
              key={i}
            >
              {child}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Group;
