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
            alignment={{ justifyContent: "space-between" }}
          >
            <Text>Logs</Text>
            <Group direction="row" spacing={6}>
              <Text>SHOW ALL</Text>
              <Text>ERRORS</Text>
              <Text>CLEAR</Text>
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
            <Text>Welcome to the Stripe Terminal reference app</Text>
            <Text>Start by filling your API key then connect to a reader.</Text>
          </Group>
        </div>
      </div>
    );
  }
}

export default Logs;
