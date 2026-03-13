import React, { useContext } from "react";
import Navbar from "./Navbar";
import { UserContext } from "../../context/UserContext";

const DashboardLayout = ({ children }) => {
  const { user } = useContext(UserContext);
  return (
    <div className="bg-[var(--color-bg)] min-h-screen">
      <div className="pt-5">
        <Navbar />
      </div>
      {user && <div>{children}</div>}
    </div>
  );
};

export default DashboardLayout;
