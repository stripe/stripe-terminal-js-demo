//@flow

import * as React from "react";

const Flex = ({ children, className, ...props }) => {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        ...props
      }}
    >
      {children}
    </div>
  );
};

export default Flex;
