import * as React from "react";

import { css } from "emotion";

class Button extends React.Component {
  getColor = color => {
    switch (color) {
      case "dark":
        return "#3B415E";
      case "grey":
        return "#C1C9D2";
      case "lightGrey":
        return "#8792A2";
      case "link":
        return "#78ACF8";
      case "white":
        return "#FFFFFF";
      default:
        return "#586ADA";
    }
  };

  render() {
    const { children, color, disabled, onClick } = this.props;

    return (
      <button
        className={css`
          background: ${this.getColor(color)};
          border-radius: 4px 4px 4px 4px;
          box-shadow: 0 0 0 1px rgba(43, 45, 80, 0.1),
            0 2px 5px 0 rgba(43, 45, 80, 0.08),
            0 1px 1.5px 0 rgba(0, 0, 0, 0.07), 0 1px 2px 0 rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;

          :disabled {
            pointer-events: none;
            opacity: 0.5;
          }

          :hover {
            opacity: 0.9;
          }
        `}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
}
export default Button;
