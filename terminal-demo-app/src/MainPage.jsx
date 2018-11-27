import React, { Component } from "react";

import BackendURLForm from "./Forms/BackendURLForm.jsx";
import ConnectionInfo from "./ConnectionInfo/ConnectionInfo.jsx";
import Group from "./components/Group/Group.jsx";
import Logs from "./Logs/Logs.jsx";

import { css } from "emotion";

class MainPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      backendURL: null,
      reader: null
    };
  }

  onSetBackendURL = url => {
    this.setState({ backendURL: url });
  };

  onSetReader = reader => {
    this.setState({ reader });
  };

  render() {
    const { backendURL, reader } = this.state;
    return (
      <div
        className={css`
          padding: 41px 10vw;
        `}
      >
        <Group direction="row" spacing={43} responsive>
          <Group direction="column" spacing={16} responsive>
            <ConnectionInfo backendURL={backendURL} reader={reader} />
            <BackendURLForm onSetBackendURL={this.onSetBackendURL} />
          </Group>
          <Logs />
        </Group>
      </div>
    );
  }
}

export default MainPage;
