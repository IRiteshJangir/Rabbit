import React, { useState } from "react";
import { FaBarcode, FaBars } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const togglesIdebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* mobile toggle button */}
      <div className="flex md:hidden p-4 bg-gray-900 text-white z-20">
        <button onClick={togglesIdebar}>
          <FaBars size={24} />
        </button>
        <h1 className="ml-4 text-xl font-medium">Admin DashBoard</h1>
      </div>
      {/* overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0  z-10 bg-black/50 md:hidden"
          onClick={togglesIdebar}
        ></div>
      )}

      {/* sidebar */}
      <div
        className={`bg-gray-900 w-64 min-h-screen text-white absolute md:static transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 md:block z-20`}
      >
        {/* sidebar component for admin */}
        <AdminSidebar />
      </div>
      {/* main content */}
      <div className="grow p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
