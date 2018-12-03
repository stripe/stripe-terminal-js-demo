//@flow

import * as React from "react";
import { css } from "emotion";
import "./Logs.css";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Button from "../components/Button/Button.jsx";
import Group from "../components/Group/Group.jsx";
import Logger from "../logger";
import Text from "../components/Text/Text.jsx";
import Link from "../components/Link/Link.jsx";

class Logs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      logs: []
    };
    Logger.setCollectors([this]);
  }

  collect(log) {
    this.setState(state => ({
      logs: [log, ...state.logs]
    }));
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
    if (json.length === 0) {
      return "()";
    }
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
          <TransitionGroup className="todo-list">
            {logs.map(log => {
              const returnType = log.response
                ? "RESPONSE"
                : log.exception
                ? "EXCEPTION"
                : "VOID";
              return (
                <CSSTransition key={log.id} timeout={500} classNames="fade">
                  <div
                    className={css`
                      border-bottom: 1px solid #4e566d;
                      padding: 20px;
                    `}
                  >
                    <Group direction="column">
                      <Group
                        direction="row"
                        alignment={{ justifyContent: "space-between" }}
                      >
                        <Group
                          direction="row"
                          alignment={{ alignItems: "center" }}
                        >
                          <Text color="code" size={14}>
                            {log.method}
                          </Text>

                          <Link
                            size={14}
                            href={log.docsUrl}
                            text="Learn more"
                            newWindow
                          />
                        </Group>
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

                      <Text color="link">{returnType}</Text>
                      {returnType !== "VOID" ? (
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
                      ) : (
                        ""
                      )}
                    </Group>
                  </div>
                </CSSTransition>
              );
            })}
          </TransitionGroup>
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
            alignment={{
              justifyContent: "space-between",
              alignItems: "center"
            }}
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
