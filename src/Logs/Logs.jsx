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
      <div className="Logs-empty">
        <Group
          direction="column"
          spacing={8}
          alignment={{ alignItems: "center", textAlign: "center" }}
        >
          <Text size={14}>Welcome to the Stripe Terminal reference app</Text>
          <Text size={12} color="lightGrey">
            Start by filling your backend server URL, then connect to a reader.
            The SDK comes with a simple reader simulator, so you can get started
            without any physical hardware.
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
      <div className="Logs-content">
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
                        <Link
                          size={14}
                          href={log.docsUrl}
                          text={log.method}
                          newWindow
                        />
                      </Group>
                      <Text color="lightGrey" size={12}>
                        {new Date(log.start_time_ms).toLocaleString()}
                      </Text>
                    </Group>
                    <Text color="lightGrey">REQUEST</Text>
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

                    <Text color="lightGrey">{returnType}</Text>
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
      </div>
    );
  }

  render() {
    const { logs } = this.state;
    return (
      <div className="Logs">
        <div className="Logs-header">
          <Text size="16px" color="grey">
            Logs
          </Text>
          <Button color="textDark" onClick={this.clearLogs}>
            Clear
          </Button>
        </div>
        <div className="Logs-body">
          {logs.length < 1 ? this.renderEmpty() : this.renderLogs(logs)}
        </div>
      </div>
    );
  }
}

export default Logs;
