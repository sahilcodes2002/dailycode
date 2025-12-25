// import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Headerhome = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="dashboard-header">
        <div className="flex justify-between">
          {/* Logo Section */}
          <div className="logo-wrapper">
            <div className="logo-image mt-3">
              {/* You can place your logo image here if needed */}
            </div>
            <h1 className="ml-4 text-4xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pt-2 pd-8">
              AUTO NOTE
            </h1>
          </div>
          {/* Login Button */}
          <Link
            to="/signin"
            className="text-white px-3 mr-3 py-1 bg-[rgb(47,141,113)] hover:bg-[rgb(18,107,70)] rounded-xl mt-3 mb-auto text-sm"
          >
            Log in
          </Link>
        </div>
      </div>
    </>
  );
};

export default Headerhome;
