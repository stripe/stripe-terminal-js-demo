import * as React from "react";

import { css } from "emotion";

class Button extends React.Component {
  getButtonColor = color => {
    switch (color) {
      case "primary":
        return "#586ADA";
      case "secondary":
      default:
        return "#FFFFFF";
    }
  };

  getTextButtonColor = color => {
    switch (color) {
      case "textDark":
        return "#78acf8";
      case "text":
      default:
        return "#586ADA";
    }
  };

  getButtonHoverColor = color => {
    switch (color) {
      case "primary":
        return "#484bad";
      case "secondary":
      default:
        return "#C1C9D2";
    }
  };

  getButtonStyles = type => {
    switch (type) {
      case "text":
      case "textDark":
        return css`
          font-weight: 600;
          font-size: 11px;
          color: ${this.getTextButtonColor(type)};
          letter-spacing: 0.06px;
          background: transparent;
          text-transform: uppercase;
          border: 0;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 0;

          :hover {
            color: #9fcdff;
          }

          :focus {
            outline: 0;
          }
        `;
      case "primary":
      case "secondary":
      case "default":
      default:
        return css`
          background: ${this.getButtonColor(type)};
          box-shadow: 0 0 0 1px rgba(50, 50, 93, 0.1),
            0 2px 5px 0 rgba(50, 50, 93, 0.1), 0 1px 1px 0 rgba(0, 0, 0, 0.07);
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
            background-color: ${this.getButtonColor(type)};
          }

          :focus {
            outline: 0;
          }
        `;
    }
  };

  render() {
    const { children, disabled, onClick, color } = this.props;

    return (
      <button
        className={this.getButtonStyles(color)}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
}
export default Button;
