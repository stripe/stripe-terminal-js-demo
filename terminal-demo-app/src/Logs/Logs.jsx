//@flow

import * as React from "react";

import "./Logs.css";

import Group from "../Group/Group.jsx";
import Text from "../Text/Text.jsx";

class Logs extends React.Component {
  render() {
    return (
      <div className="Logs">
        <div className="Logs-header">
          <Group
            direction="row"
            spacing={0}
            alignment={{ justifyContent: "space-between" }}
          >
            <Text size="16px" color="grey">
              Logs
            </Text>
            <Group direction="row" spacing={6}>
              <Text size={11}>SHOW ALL</Text>
              <Text size={11} color="lightGrey">
                ERRORS
              </Text>
              <Text size={11} color="lightGrey">
                CLEAR
              </Text>
            </Group>
          </Group>
        </div>
        <div className="Logs-body">
          <Group
            direction="column"
            spacing={8}
            alignment={{ justifyContent: "center" }}
          >
            <Text>{`{}`}</Text>
            <Text size={14}>Welcome to the Stripe Terminal reference app</Text>
            <Text size={11} color="lightGrey">
              Start by filling your API key then connect to a reader.
            </Text>
          </Group>
        </div>
      </div>
    );
  }
}

export default Logs;
