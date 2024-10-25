import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

//icons
import {
  FiHome,
  FiMonitor,
  FiShoppingBag,
  FiCalendar,
  FiUsers,
  FiUser,
} from "react-icons/fi";
import {
  RiHome3Line,
  RiHome3Fill,
  RiMacbookLine,
  RiMacbookFill,
  RiShoppingBag2Line,
  RiShoppingBag2Fill,
  RiCalendarEventLine,
  RiCalendarEventFill,
  RiUserSmileLine,
  RiUserSmileFill,
  RiUser4Line,
  RiUser4Fill,
} from "react-icons/ri";

const Navbar = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath.includes("/dashboard")) {
      setActiveTab("dashboard");
    } else if (currentPath.includes("/monitor")) {
      setActiveTab("monitor");
    } else if (currentPath.includes("/redeem")) {
      setActiveTab("redeem");
    } else if (currentPath.includes("/history")) {
      setActiveTab("history");
    } else if (currentPath.includes("/users")) {
      setActiveTab("users");
    } else if (currentPath.includes("/profile")) {
      setActiveTab("profile");
    }
  }, [location]);

  return (
    <>
      <div className="fixed h-[100svh] left-0 flex items-center justify-center p-4 ">
        <div className="flex flex-col items-center justify-center rounded-xl bg-[#FAFAFA] p-2 shadow-xl shadow-black/20 space-y-1">
          <div
            className="p-2 flex items-center justify-center cursor-pointer rounded-full"
            onClick={() => navigate("/admin/dashboard")}
          >
            {activeTab === "dashboard" ? (
              <RiHome3Fill size={20} color="#699900" />
            ) : (
              <RiHome3Line size={20} color="#9aa2a6" />
            )}
          </div>
          <div
            className="p-2 flex items-center justify-center cursor-pointer rounded-full"
            onClick={() => setActiveTab("monitor")}
          >
            {activeTab === "monitor" ? (
              <RiMacbookFill size={20} color="#699900" />
            ) : (
              <RiMacbookLine size={20} color="#9aa2a6" />
            )}
          </div>
          <div
            className="p-2 flex items-center justify-center cursor-pointer rounded-full"
            onClick={() => setActiveTab("redeem")}
          >
            {activeTab === "redeem" ? (
              <RiShoppingBag2Fill size={20} color="#699900" />
            ) : (
              <RiShoppingBag2Line size={20} color="#9aa2a6" />
            )}
          </div>
          <div
            className="p-2 flex items-center justify-center cursor-pointer rounded-full"
            onClick={() => setActiveTab("history")}
          >
            {activeTab === "history" ? (
              <RiCalendarEventFill size={20} color="#699900" />
            ) : (
              <RiCalendarEventLine size={20} color="#9aa2a6" />
            )}
          </div>
          <div
            className="p-2 flex items-center justify-center cursor-pointer rounded-full"
            onClick={() => setActiveTab("users")}
          >
            {activeTab === "users" ? (
              <RiUserSmileFill size={20} color="#699900" />
            ) : (
              <RiUserSmileLine size={20} color="#9aa2a6" />
            )}
          </div>
          <div
            className="p-2 flex items-center justify-center cursor-pointer rounded-full"
            onClick={() => {
              navigate("/admin/profile");
            }}
          >
            {activeTab === "profile" ? (
              <RiUser4Fill size={20} color="#699900" />
            ) : (
              <RiUser4Line size={20} color="#9aa2a6" />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
