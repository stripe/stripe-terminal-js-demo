//@flow

import * as React from "react";

import { breakpoints } from "../../styles.jsx";
import { css } from "emotion";

class Group extends React.Component {
  getMarginType = direction => {
    if (direction === "column") {
      return "marginTop";
    }
    return "marginLeft";
  };

  getMarginStyles = (direction, responsive, spacing) => {
    if (responsive) {
      return {
        [breakpoints.laptop]: {
          "> :not(:first-child)": {
            [this.getMarginType(direction)]: spacing
          }
        },
        [breakpoints.mobile]: {
          "> :not(:first-child)": {
            marginTop: spacing
          },
          flexDirection: "column"
        }
      };
    } else {
      return {
        "> :not(:first-child)": {
          [this.getMarginType(direction)]: spacing
        }
      };
    }
  };

  render() {
    const {
      alignment,
      children,
      direction = "row",
      responsive,
      spacing = 8
    } = this.props;

    return (
      <div
        className={css({
          display: "flex",
          flexDirection: direction,
          ...this.getMarginStyles(direction, responsive, spacing),
          ...alignment
        })}
      >
        {children}
      </div>
    );
  }
}

export default Group;
