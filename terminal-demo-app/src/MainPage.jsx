import React, { Component } from "react";

import APIKeyForm from "./APIKeyForm/APIKeyForm.jsx";
import ConnectionInfo from "./ConnectionInfo/ConnectionInfo.jsx";
import Group from "./lib/Group/Group.jsx";
import Logs from "./Logs/Logs.jsx";

import { css } from "emotion";

class MainPage extends Component {
  render() {
    return (
      <div
        className={css`
          padding: 41px 10vw;
        `}
      >
        <Group direction="row" spacing={43} responsive>
          <Group direction="column" spacing={16} responsive>
            <ConnectionInfo />
            <APIKeyForm />
          </Group>
          <Logs />
        </Group>
      </div>
    );
  }
}

export default MainPage;
