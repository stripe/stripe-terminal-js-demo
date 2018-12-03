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
          alignment={{ alignItems: "center", textAlign: "center" }}
        >
          <Text>{`{}`}</Text>
          <Text size={14}>Welcome to the Stripe Terminal reference app</Text>
          <Text size={11} color="lightGrey">
            Start by filling your backend URL then connect to a reader. The SDK
            comes with a simple reader simulator, so you can get started without
            any physical hardware.
          </Text>
        </Group>
      </div>
    );
  }

  renderJSON(resp) {
    if (resp) {
      try {
        return JSON.stringify(JSON.parse(resp), undefined, 2);
      } catch (e) {
        return resp;
      }
    } else return null;
  }

  renderRequestJSON(req) {
    const json = JSON.parse(req);
    return JSON.stringify(json[0], undefined, 2);
  }

  renderLogs(logs) {
    return (
      <div
        className={css`
          overflow-y: scroll;
          height: 550px;
        `}
      >
        <Group direction="column">
          {logs.reverse().map((log, i) => {
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
                      <code>{new Date(log.start_time_ms).toString()}</code>
                    </Text>
                  </Group>
                  <Text color="link">REQUEST</Text>
                  <Text color="lightGrey">
                    <pre>
                      <code
                        className={css`
                          color: #8792a2;
                        `}
                      >
                        {this.renderRequestJSON(log.request)}
                      </code>
                    </pre>
                  </Text>

                  <Text color="link">
                    {isErrored ? "EXCEPTION" : "RESPONSE"}
                  </Text>
                  <Text color="lightGrey">
                    <pre>
                      <code
                        className={css`
                          color: #8792a2;
                        `}
                      >
                        {this.renderJSON(log.response || log.exception)}
                      </code>
                    </pre>
                  </Text>
                </Group>
              </div>
            );
          })}
        </Group>
      </div>
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
                <Text size={12} color="darkGrey">
                  Clear
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
