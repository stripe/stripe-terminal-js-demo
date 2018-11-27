import React, { Component } from "react";

import BackendURLForm from "./Forms/BackendURLForm.jsx";
import CommonWorkflows from "./Forms/CommonWorkflows.jsx";
import ConnectionInfo from "./ConnectionInfo/ConnectionInfo.jsx";
import DiscoverReaders from "./Forms/DiscoverReaders.jsx";
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

  renderForm() {
    const { backendURL, reader } = this.state;
    if (backendURL === null && reader === null) {
      return <BackendURLForm onSetBackendURL={this.onSetBackendURL} />;
    } else if (reader === null) {
      return <DiscoverReaders onSetReader={this.onSetReader} />;
    } else {
      return <CommonWorkflows />;
    }
  }

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
            {this.renderForm()}
          </Group>
          <Logs />
        </Group>
      </div>
    );
  }
}

export default MainPage;
