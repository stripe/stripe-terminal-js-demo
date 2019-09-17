import * as React from "react";

// import { css } from "emotion";

import cancel from "./svg/icon-cancel.svg";
import card from "./svg/icon-card.svg";
import chevronDown from "./svg/icon-chevrondown.svg";
import keypad from "./svg/icon-keypad.svg";
import list from "./svg/icon-list.svg";
import lock from "./svg/icon-lock.svg";
import more from "./svg/icon-more.svg";
import payments from "./svg/icon-payments.svg";
import reader from "./svg/icon-reader.svg";
import refresh from "./svg/icon-refresh.svg";

const ICONS = {
  cancel,
  card,
  chevronDown,
  keypad,
  list,
  lock,
  more,
  payments,
  reader,
  refresh
};

class Icon extends React.Component {
  render() {
    const { icon } = this.props;
    return <object data={ICONS[icon]} tabIndex="-1">""</object>;
  }
}

export default Icon;
