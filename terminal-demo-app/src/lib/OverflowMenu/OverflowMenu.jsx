import * as React from "react";

import { css } from "emotion";
import onClickOutside from "react-onclickoutside";

class OverflowMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shown: false
    };
  }

  handleClickOutside = e => {
    this.setState({ shown: false });
  };

  onClick = e => {
    this.setState({ shown: !this.state.shown });
  };

  render() {
    const { shown } = this.state;
    const { children } = this.props;

    return (
      <div
        className={css`
          display: flex;
        `}
      >
        <button
          className={css`
            height: 20px;
            width: 20px;
            border: none;

            background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+c3RhdGljPC90aXRsZT48cGF0aCBkPSJNNSAxMS43NWExLjc1IDEuNzUgMCAxIDEgMC0zLjUgMS43NSAxLjc1IDAgMCAxIDAgMy41em01IDBhMS43NSAxLjc1IDAgMSAxIDAtMy41IDEuNzUgMS43NSAwIDAgMSAwIDMuNXptNSAwYTEuNzUgMS43NSAwIDEgMSAwLTMuNSAxLjc1IDEuNzUgMCAwIDEgMCAzLjV6IiBmaWxsPSIjODg5OEFBIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=");
            cursor: pointer;

            transition: background-image 0.08s ease-in;

            :hover {
              background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+dGFyZ2V0SG92ZXI8L3RpdGxlPjxnIGZpbGw9IiM0MjQ3NzAiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGNpcmNsZSBmaWxsLW9wYWNpdHk9Ii4xIiBjeD0iMTAiIGN5PSIxMCIgcj0iMTAiLz48cGF0aCBkPSJNNSAxMS43NWExLjc1IDEuNzUgMCAxIDEgMC0zLjUgMS43NSAxLjc1IDAgMCAxIDAgMy41em01IDBhMS43NSAxLjc1IDAgMSAxIDAtMy41IDEuNzUgMS43NSAwIDAgMSAwIDMuNXptNSAwYTEuNzUgMS43NSAwIDEgMSAwLTMuNSAxLjc1IDEuNzUgMCAwIDEgMCAzLjV6Ii8+PC9nPjwvc3ZnPg==");
            }

            :active {
              background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+dGFyZ2V0QWN0aXZlPC90aXRsZT48ZyBmaWxsPSIjMzIzMjVEIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbC1vcGFjaXR5PSIuMSIgY3g9IjEwIiBjeT0iMTAiIHI9IjEwIi8+PHBhdGggZD0iTTUgMTEuNzVhMS43NSAxLjc1IDAgMSAxIDAtMy41IDEuNzUgMS43NSAwIDAgMSAwIDMuNXptNSAwYTEuNzUgMS43NSAwIDEgMSAwLTMuNSAxLjc1IDEuNzUgMCAwIDEgMCAzLjV6bTUgMGExLjc1IDEuNzUgMCAxIDEgMC0zLjUgMS43NSAxLjc1IDAgMCAxIDAgMy41eiIvPjwvZz48L3N2Zz4=");
            }
          `}
          onClick={this.onClick}
        />
        {shown && (
          <div
            className={css`
              display: flex;
              flex-direction: column;
              position: absolute;
              transform-origin: 50% -11px;
              transform: translatey(30px) translatex(-4px);
            `}
          >
            <div
              className={css`
                background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMSIgaGVpZ2h0PSI5IiB2aWV3Qm94PSIwIDAgMjEgOSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjODg5OEFBIiBmaWxsLW9wYWNpdHk9Ii4xIiBkPSJNMSA5LjA5MmgxOWwtNi40MDItNi43NGMtMS43MTctMS44MDYtNC40ODUtMS44LTYuMTk2IDBMMSA5LjA5M3pNMjAuMzQyIDhsLTYuMDItNi4zMzZjLTIuMTA4LTIuMjItNS41MzgtMi4yMTgtNy42NDUgMEwuNjU4IDhoMTkuNjg0eiIvPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik03LjQwMiAyLjM1M2MxLjcxMS0xLjgwMSA0LjQ4LTEuODA3IDYuMTk2IDBMMjAgOS4wOTNIMWw2LjQwMi02Ljc0eiIvPjwvZz48L3N2Zz4=")
                  no-repeat;
                height: 21px;
                width: 21px;
                background-position: center center;
                z-index: 301;
                transform: translatey(-14px) translatex(4px);
              `}
            />
            <div
              className={css`
                position: absolute;
                z-index: 300;
                background-color: white;
                box-shadow: 0px 0px 0px 1px rgba(136, 152, 170, 0.1),
                  0px 15px 35px 0px rgba(49, 49, 93, 0.1),
                  0px 5px 15px 0px rgba(0, 0, 0, 0.08);
                border-radius: 4px;
                padding-bottom: 8px;
                padding-top: 8px;
              `}
            >
              {children}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default onClickOutside(OverflowMenu);
