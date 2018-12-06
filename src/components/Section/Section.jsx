import * as React from "react";

import { breakpoints } from "../../styles.jsx";
import { css } from "emotion";

const commonCSS = {
  background: "#ffffff",
  boxShadow: "0 3px 6px 0 rgba(0,0,0,0.07)",
  flexShrink: 0,
  padding: "16px",
  [breakpoints.laptop]: {
    width: "310px"
  },
  [breakpoints.mobile]: {
    width: "100%"
  },
  borderBottom: "1px solid #e3e8ee",
  display: "block",
  alignItems: "center",
  justifyContent: "space-between"
};

class Section extends React.Component {
  render() {
    const { alignment, children, position } = this.props;
    let borderRadius;
    switch (position) {
      case "first":
        borderRadius = "14px 14px 0 0";
        break;
      case "last":
        borderRadius = "0 0 14px 14px";
        break;
      case "middle":
        borderRadius = "0 0 0 0";
        break;
      default:
        borderRadius = "14px 14px 14px 14px";
    }

    return (
      <div
        className={css({
          ...commonCSS,
          borderRadius,
          ...alignment
        })}
      >
        {children}
      </div>
    );
  }
}

export default Section;
