import React from "react";

export default function Container({ children, className }) {
  return <div className={`container p-8 mx-auto ${className}`}>{children}</div>;
}
