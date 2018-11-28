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

  onSetReader = reader => {
    this.props.onSetReader(reader);
  };

  onClickRegister = () => {
    this.setState({ mode: "register" });
  };

  render() {
    const { mode } = this.state;
    switch (mode) {
      case "list":
        return (
          <DiscoverReaders
            onClickRegister={this.onClickRegister}
            onSetReader={this.onSetReader}
          />
        );
      case "register":
        return <RegisterNewReader onSetReader={this.onSetReader} />;
      default:
        return null;
    }
  }
}

export default Readers;
