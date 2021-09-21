import React from "react";
import ReactDOM from "react-dom";
import MainPage from "./MainPage";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<MainPage />, div);
  ReactDOM.unmountComponentAtNode(div);
});
