import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { info } from "../store/atoms/userinfo";
import { useRecoilValue } from "recoil";

export function Topbarlogin({ toggleSidebar, isSidebarOpen }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const allInfo = useRecoilValue(info);
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const formattedDate = currentTime.toLocaleDateString();

  return (
    <div className="z-50 bg-[rgb(41,127,101)] text-mytext flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <div className="h-full flex flex-col justify-center">
          <button
            onClick={toggleSidebar}
            data-drawer-target="separator-sidebar"
            data-drawer-toggle="separator-sidebar"
            aria-controls="separator-sidebar"
            type="button"
            className="inline-flex items-center p-1 mt-2 ms-3 mb-1 text-sm text-mytext rounded-lg hover:text-gray-400  "
          >
            <span className="sr-only">Open sidebar</span>
            {!isSidebarOpen && (
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                ></path>
              </svg>
            )}
            {isSidebarOpen && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="flex gap-1">
          {/* <div className="flex flex-col justify-center">
            <button>
              <div
                onClick={() => {
                  navigate("/userprofile");
                }}
                className="rounded-full text-[15px] text-gray-700 bg-gray-200 text-center h-6 w-6 mr-1"
              >
                {allInfo.name ? allInfo.name[0].toUpperCase() : "?"}
              </div>
            </button>
          </div> */}
          
          <button>
            <div className="flex  flex-col h-full justify-center">
              <span
                onClick={() => {
                  navigate("/userprofile");
                }}
                className="text-sm md:flex smd:text-xl  text-mytext"
              >
                {allInfo.name.split(" ")[0]}
              </span>
            </div>
          </button>
        </div>
      </div>
      <div className={`flex items-center space-x-8 text-xs `}>
        <div
          className={`text-right ${
            isSidebarOpen ? "hidden smd:block" : "block"
          }`}
        >
          <div className="text-mytext">{formattedDate}</div>
        </div>
        <div className="pr-1 smd:pr-2">
          <button
            onClick={() => {
              navigate(`/assistant`);
            }}
            className="  text-mytext font-semibold  rounded-lg transition duration-300 mr-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m10 7l-.516 1.394c-.676 1.828-1.014 2.742-1.681 3.409s-1.581 1.005-3.409 1.681L3 14l1.394.516c1.828.676 2.742 1.015 3.409 1.681s1.005 1.581 1.681 3.409L10 21l.516-1.394c.676-1.828 1.015-2.742 1.681-3.409s1.581-1.005 3.409-1.681L17 14l-1.394-.516c-1.828-.676-2.742-1.014-3.409-1.681s-1.005-1.581-1.681-3.409zm8-4l-.221.597c-.29.784-.435 1.176-.72 1.461c-.286.286-.678.431-1.462.72L15 6l.598.221c.783.29 1.175.435 1.46.72c.286.286.431.678.72 1.462L18 9l.221-.597c.29-.784.435-1.176.72-1.461c.286-.286.678-.431 1.462-.72L21 6l-.598-.221c-.783-.29-1.175-.435-1.46-.72c-.286-.286-.431-.678-.72-1.462z" color="currentColor"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
