import React from "react";
import style from "./style.module.css";

const Tab = ({
  children,
  onClick,
  isActive = false,
}: {
  children?: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
}) => {
  return (
    <div
      className={`${style.tab} ${isActive ? style.active : undefined}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
export default Tab;
