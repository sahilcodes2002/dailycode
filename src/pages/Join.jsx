import { useState, useEffect } from "react";
import axios from "axios";
// import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil";
// import { todos } from "../store/atoms/todos";
// import { info } from "../store/atoms/userinfo";
import React from "react";
import { Link, useNavigate } from 'react-router-dom';
//import ss from "../images/logo.png";

export function Join() {
  const [verified, setVerified] = useState(false);
  const [codematch, setCodematch] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [verifytry, setVerifytry] = useState(0);
  const [username, setUsername] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const [todo, setTodoList] = useRecoilState(todos);
  // const [inf, setInfo] = useRecoilState(info);

  useEffect(() => {
    const token = localStorage.getItem("autotoken699");
    if (token) {
      //navigate("/dashboard")
    }
  }, []);

  return (
    <div>
      <div className="signup-container bg-gray-100 min-h-screen ">
        {/* Top Bar Section */}
        <div className="h-screen  pb-2">
          <div className="signup-container pt-2 px-6">
                      <div className="flex justify-between">
                          <div class="logo-wrapper">
                            {/* <div class="logo-image"><img className="rounded-md" src={ss} alt="Design" /></div> */}
                            <div class="logo-text"> DailyCode</div>
                            </div>
                          <Link to="/signin" className="text-white px-3 py-1 bg-[rgb(47,141,113)]  hover:bg-[rgb(18,107,70)] rounded-xl mt-3 mb-auto text-sm">
                              Log in
                          </Link>
                      </div>
                  </div>


          {/* <br className={`${codematch ? "hidden" : ""}`}></br> */}
          {/* <br className={`${codematch ? "hidden" : ""}`} A></br> */}
          <div className="flex justify-center">
            <div style={{ width: "90vw" }} className="flex justify-center">
              <div className="mx-auto">
                <div className="max-w-5xl mx-auto mt-5">
                  <div className="max-w-2xl text-center mx-auto p-3">
                    <p
                      style={{ fontWeight: 650 }}
                      className=" text-center font-sans  leading-tight text-[30px] smd:text-[39px] text-black text-opacity-80"
                    >
                      Create your account and start using DailyCode
                    </p>
                    <p
                      style={{ fontWeight: 650 }}
                      className="mt-3 text-center font-sans  leading-tight text-[15px]  text-black text-opacity-80"
                    >
                      Already have a DailyCode Account?{" "}
                      <Link
                        to="/signin"
                        className="font-normal text-[rgb(47,141,113)] underline hover:no-underline block sm:inline"
                      >
                        {" "}
                        Log in to DailyCode
                      </Link>
                    </p>
                  </div>
                  <div
                    className={`text-center ${
                      codematch ? "mt-3" : "mt-10"
                    } mx-5 `}
                  >
                    <label
                      for="first_name"
                      className="block mb-2  font-medium text-gray-900 "
                    >
                      Email
                    </label>
                    <div className="w-full flex justify-center">
                      <input
                        onChange={(e) => {
                          setUsername(e.target.value);
                        }}
                        type="text"
                        className={`w-[250px] bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 ${
                          loading || verified || codematch
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        placeholder="John@gmail.com"
                        required
                      />
                    </div>
                    <br className={`${codematch ? "hidden" : ""}`}></br>

                    {!verified && (
                      <button
                        onClick={async () => {
                          if (username == "") {
                            alert("fill all the credentials");
                          } else {
                            console.log(username);
                            setLoading(true);
                            setVerifytry((x) => x + 1);
                            try {
                              const response = await axios.post(
                                "https://dailycode.dailycode.workers.dev/varification",
                                {
                                  email: username.trim(),
                                }
                              );
                              if (response.data.success == true) {
                                console.log(response.data);
                                setVerified(true);
                              }
                              setLoading(false);

                              //localStorage.setItem("token", response.data.token)
                              //setTodoList(response.data.res.todo);
                              // setInfo({
                              //     name:response.data.res.name,
                              //     username:response.data.res.username,
                              //     id:response.data.res.id

                              // })
                              //navigate(`/dashboard`)
                            } catch (error) {
                              console.error("Error during signup", error);
                            } finally {
                              setLoading(false);
                            }
                          }
                        }}
                        className={`bg-[rgb(47,141,113)] hover:bg-[rgb(18,107,70)] text-white py-[16px] px-20 md:py-[16px] md:px-20 rounded-md transition duration-300 font-semibold border-none text-sm ${
                          loading || verified
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={loading || verified}
                      >
                        {!loading && (
                          <p>
                            {verifytry > 0 && <p>Try again</p>}
                            {verifytry == 0 && <p>Verify email</p>}
                          </p>
                        )}
                        {loading && <p>Loading..</p>}
                      </button>
                    )}
                    {verified && !codematch && (
                      <div>
                        <div>Verification code is sent to your mail</div>
                        <div>
                          <label
                            for="first_name"
                            className="block mb-2  font-medium text-gray-900 "
                          >
                            Enter 4 digit code
                          </label>
                          <div className="w-full flex justify-center">
                            <input
                              onChange={(e) => {
                                setVerifyCode(e.target.value);
                              }}
                              type="text"
                              className=" w-[100px] bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 "
                              placeholder=""
                              required
                            />
                          </div>
                        </div>
                        {!codematch && (
                          <button
                            onClick={async () => {
                              if (username == "") {
                                alert("please enter the code");
                              } else {
                                console.log(username);
                                setLoading(true);
                                setVerifytry((x) => x + 1);
                                try {
                                  const response = await axios.post(
                                    "https://dailycode.dailycode.workers.dev/varifycode",
                                    {
                                      email: username.trim(),
                                      code: verifyCode.trim(),
                                    }
                                  );
                                  if (response.data.success == true) {
                                    console.log(response.data);
                                    setCodematch(true);
                                  } else {
                                    setVerified(false);
                                    setCodematch(false);
                                  }
                                  setLoading(false);

                                  //localStorage.setItem("token", response.data.token)
                                  //setTodoList(response.data.res.todo);
                                  // setInfo({
                                  //     name:response.data.res.name,
                                  //     username:response.data.res.username,
                                  //     id:response.data.res.id

                                  // })
                                  //navigate(`/dashboard`)
                                } catch (error) {
                                  console.error("Error during signup", error);
                                } finally {
                                  setLoading(false);
                                }
                              }
                            }}
                            className={`bg-[rgb(47,141,113)] hover:bg-[rgb(18,107,70)] text-white py-[16px] mt-4 px-20 md:py-[16px] md:px-20 rounded-md transition duration-300 font-semibold border-none text-sm ${
                              loading || codematch
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={loading || codematch}
                          >
                            {!loading && <p>Submit</p>}
                            {loading && <p>Loading..</p>}
                          </button>
                        )}
                        <div></div>
                      </div>
                    )}
                    {codematch && (
                      <div>
                        <label
                          for="first_name"
                          className="block mb-2  font-medium text-gray-900 "
                        >
                          Name
                        </label>
                        <div className="w-full flex justify-center">
                          <input
                            maxLength="50"
                            onChange={(e) => {
                              setFirstName(e.target.value);
                            }}
                            type="text"
                            className=" w-[250px] bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 "
                            placeholder="John"
                            required
                          />
                        </div>
                        <label
                          for="first_name"
                          className="block mb-2  font-medium text-gray-900 "
                        >
                          Password
                        </label>
                        <div className="w-full flex justify-center">
                          <input
                            onChange={(e) => {
                              setPassword(e.target.value);
                            }}
                            type="password"
                            className=" w-[250px] bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 "
                            placeholder="*********"
                            required
                          />
                        </div>
                        <button
                          onClick={async () => {
                            if (
                              firstName == "" ||
                              username == "" ||
                              password == ""
                            ) {
                              alert("fill all the credentials");
                            } else {
                              setLoading(true);
                              try {
                                const response = await axios.post(
                                  "https://dailycode.dailycode.workers.dev/signup",
                                  {
                                    name: firstName,
                                    username,
                                    password,
                                  }
                                );
                                console.log(response.data);
                                if (
                                  response.data.message &&
                                  response.data.message ==
                                    "username already exists"
                                ) {
                                  setVerified(false);
                                  setCodematch(false);
                                  alert("alreay used email");
                                } else {
                                  localStorage.setItem(
                                    "autotoken699",
                                    response.data.token
                                  );
                                  //setTodoList(response.data.res.todo);
                                  // setInfo({
                                  //     name: response.data.data.name,
                                  //     username:response.data.data.username,
                                  //     id:response.data.data.id,
                                  //     created_at:response.data.data.created_at,
                                  //     todo:response.data.data.todo,
                                  //     projects:response.data.data.projects,
                                  //     workhistory:response.data.data.workhistory,
                                  //     weeklytask:response.data.data.weeklytask,
                                  //     calenderevents:response.data.data.calenderevents,

                                  // })
                                  setLoading(false);
                                  navigate(`/signin`);
                                }
                              } catch (error) {
                                console.error("Error during signup", error);
                              } finally {
                                setLoading(false);
                              }
                            }
                          }}
                          className={`mt-4 bg-[rgb(47,141,113)] hover:bg-[rgb(18,107,70)] text-white py-[13px] px-20 md:py-[16px] md:px-20 rounded-md transition duration-300 font-semibold border-none text-sm ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          disabled={loading}
                        >
                          {!loading && <p>Sign up</p>}
                          {loading && <p>Loading..</p>}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
