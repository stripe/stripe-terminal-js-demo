import React, { Component } from "react";
import "./MainPage.css";

import APIKeyForm from "./APIKeyForm/APIKeyForm.jsx";
import { breakpoints } from "./styles.jsx";
import Flex from "./Flex/Flex.jsx";
import Logs from "./Logs/Logs.jsx";

import { css } from "emotion";

class MainPage extends Component {
  render() {
    return (
      <div className="MainPage">
        <Flex
          className={css({
            [breakpoints.laptop]: {
              "> :not(:first-child)": {
                marginLeft: 43
              }
            },
            [breakpoints.mobile]: {
              "> :not(:first-child)": {
                marginTop: 43
              },
              flexDirection: "column"
            }
          })}
        >
          <APIKeyForm />
          <Flex width="100%">
            <Logs />
          </Flex>
        </Flex>
      </div>
    );
  }
}

export default MainPage;
