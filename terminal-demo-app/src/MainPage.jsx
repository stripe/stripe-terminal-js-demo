import React, { Component } from "react";
import "./MainPage.css";

import Logs from "./Logs/Logs.jsx";

class MainPage extends Component {
  render() {
    return (
      <div className="MainPage">
        <Logs />
      </div>
    );
  }
}

export default MainPage;
