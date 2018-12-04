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
      case "default":
      default:
        return "#586ADA";
    }
  };
  getHoverColor = color => {
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
      case "default":
      default:
        return "#484bad";
    }
  };

  getHoverTextColor = color => {
    switch (color) {
      case "dark":
        return "white";
      case "grey":
        return "#2B2D50";
      case "lightGrey":
        return "#2B2D50";
      case "link":
        return "#2B2D50";
      case "white":
        return "#2B2D50";
      case "default":
      default:
        return "white";
    }
  };

  render() {
    const { children, color, disabled, onClick } = this.props;

    return (
      <button
        className={css`
          background: ${this.getColor(color)};
          box-shadow: 0 2px 5px 0 rgba(50, 50, 93, 0.1),
            0 1px 1px 0 rgba(0, 0, 0, 0.07);
          border-radius: 4px;
          border: 0;
          padding: 6px 8px;
          cursor: pointer;
          transition: all 0.2s ease;

          height: 28px;

          display: flex;

          align-items: center;
          justify-content: center;

          :disabled {
            pointer-events: none;
            opacity: 0.5;
          }

          :hover {
            background-color: ${this.getHoverColor(color)};
            color: ${this.getHoverTextColor(color)};
          }

          :focus {
            outline: 0;
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
