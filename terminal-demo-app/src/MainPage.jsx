import React, { Component } from "react";

import APIKeyForm from "./APIKeyForm/APIKeyForm.jsx";
import Group from "./Group/Group.jsx";
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
          <APIKeyForm />
          <Logs />
        </Group>
      </div>
    );
  }
}

export default MainPage;
