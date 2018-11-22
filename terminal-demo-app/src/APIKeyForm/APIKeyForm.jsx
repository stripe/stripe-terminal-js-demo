import * as React from "react";

import "./APIKeyForm.css";
import { breakpoints } from "../styles.jsx";
import { css } from "emotion";

class APIKeyForm extends React.Component {
  render() {
    return (
      <div
        className={css`
          background: #ffffff;
          border-radius: 14px 14px 14px 14px;
          box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0);
          height: 146px;
          flex-shrink: 0;

          ${breakpoints.laptop} {
            width: 310px;
          }
          ${breakpoints.mobile} {
            width: 100%;
          }
        `}
      />
    );
  }
}

export default APIKeyForm;
