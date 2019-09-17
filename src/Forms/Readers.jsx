//@flow

import * as React from "react";

import DiscoverReaders from "./DiscoverReaders.jsx";
import RegisterNewReader from "./RegisterNewReader.jsx";

class Readers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: "list"
    };
  }

  onClickRegister = () => {
    this.setState({ mode: "register" });
  };

  handleSwitchToDiscover = () => {
    this.setState({ mode: "list" });
  };

  render() {
    const { mode } = this.state;

    const {
      readers,
      onClickDiscover,
      onSubmitRegister,
      onConnectToReader,
      handleUseSimulator
    } = this.props;
    switch (mode) {
      case "list":
        return (
          <DiscoverReaders
            onClickDiscover={onClickDiscover}
            onClickRegister={this.onClickRegister}
            onConnectToReader={onConnectToReader}
            readers={readers}
            handleUseSimulator={handleUseSimulator}
          />
        );
      case "register":
        return (
          <RegisterNewReader
            onClickCancel={this.handleSwitchToDiscover}
            onSubmitRegister={onSubmitRegister}
          />
        );
      default:
        return null;
    }
  }
}

export default Readers;
