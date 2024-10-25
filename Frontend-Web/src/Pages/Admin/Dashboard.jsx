import React from "react";
import { useAuth } from "../../context/AuthProvider";
import Navbar from "../../Components/Admin/Navbar";

const Dashboard = () => {
  const { onLogout } = useAuth();

  return (
    <>
      <Navbar />
      <div className="w-full min-h-[100svh] flex items-center justify-center bg-[#EDEDED] font-dm">
        <p onClick={onLogout} className="cursor-pointer">
          Dashboard
        </p>
      </div>
    </>
  );
};

export default Dashboard;
