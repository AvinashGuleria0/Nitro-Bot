import React, { useContext } from "react";
import Navbar from "./Navbar";
import { UserContext } from "../../context/UserContext";

const DashboardLayout = ({ children }) => {
  const { user } = useContext(UserContext);
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="pt-0">
        <Navbar />
      </div>
      {user && <div className="pt-20">{children}</div>}
    </div>
  );
};

export default DashboardLayout;
