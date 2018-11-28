//@flow

import * as React from "react";
import { css } from "emotion";
import "./Logs.css";

import Button from "../components/Button/Button.jsx";
import Group from "../components/Group/Group.jsx";
import Logger from "../logger";
import Text from "../components/Text/Text.jsx";

class Logs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      logs: []
    };
    Logger.setCollectors([this]);
  }

  collect(log) {
    console.log(log);
    this.setState(state => state.logs.push(log));
  }

  clearLogs = () => {
    this.setState({
      logs: []
    });
  };

  renderEmpty() {
    return (
      <div className="Logs-body">
        <Group
          direction="column"
          spacing={8}
          alignment={{ alignItems: "center" }}
        >
          <Text>{`{}`}</Text>
          <Text size={14}>Welcome to the Stripe Terminal reference app</Text>
          <Text size={11} color="lightGrey">
            Start by filling your API key then connect to a reader.
          </Text>
        </Group>
      </div>
    );
  }

  renderLogs(logs) {
    console.log(logs);
    return (
      <Group direction="column">
        {logs.map((log, i) => {
          const isErrored = log.exception;
          return (
            <div
              className={css`
                border-bottom: 1px solid #4e566d;
                padding: 20px;
              `}
              key={i}
            >
              <Group direction="column" key={i}>
                <Group
                  direction="row"
                  alignment={{ justifyContent: "space-between" }}
                >
                  <Text color="code">{log.method}</Text>
                  <Text color="lightGrey" size={12}>
                    {new Date(log.start_time_ms).toString()}
                  </Text>
                </Group>
                <Text color="link">REQUEST</Text>
                <Text color="lightGrey">{log.request}</Text>

                <Text color="link">{isErrored ? "EXCEPTION" : "RESPONSE"}</Text>
                <Text color="lightGrey">{log.response || log.exception}</Text>
              </Group>
            </div>
          );
        })}
      </Group>
    );
  }

  render() {
    const { logs } = this.state;
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
              <Button color="white" onClick={this.clearLogs}>
                <Text size={11} color="darkGrey">
                  CLEAR
                </Text>
              </Button>
            </Group>
          </Group>
        </div>
        {logs.length < 1 ? this.renderEmpty() : this.renderLogs(logs)}
      </div>
    );
  }
}

export default Logs;
