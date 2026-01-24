import Navbar from "@/components/Navbar";
import React from "react";

const DashboardLayout = ({ children }) => {
  return (
    <div>
      <Navbar links={[{ label: "Home", href: "/" }]} />
      <div className="mx-5 md:mx-20 lg:mx-36">{children}</div>
    </div>
  );
};

export default DashboardLayout;
