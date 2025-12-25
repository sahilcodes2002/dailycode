import { useState, useEffect } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputField } from "../components/InputField"
import { SubHeading } from "../components/SubHeading"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil"
import { todos } from "../store/atoms/todos";
import { info } from "../store/atoms/userinfo"
import { Link } from "react-router-dom"

export function Signup() {
    const [firstName, setFirstName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [todo,setTodoList] = useRecoilState(todos);
    const [inf, setInfo] = useRecoilState(info)
 
    useEffect(()=>{
        const token  = localStorage.getItem("autotoken699");
        if(token){
        //navigate("/dashboard")
        }
    },[])

    return (
        <div className="relative h-screen bg-slate-300 flex justify-center items-center">
            {loading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <span className="text-lg font-semibold">Loading...</span>
                    </div>
                </div>
            )}
            <div className="flex flex-col justify-center">
                <div className="w-80 rounded-xl pt-3 pb-1 bg-slate-900 ">
                    <div className="flex justify-between">
                    <div></div>
                    <Link to={'/'}><svg className="text-white pr-4 h-10 w-10"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg></Link>
                </div>
                    <div className="p-4 pt-3 pb-3 bg-slate-900">
                        <Heading title={"Sign up"} />
                    </div>
                    <div className="pt-2 text-center pl-3 pr-3">
                        <SubHeading SubHeading={"Enter your information to create an account "} />
                    </div>
                    <InputField
                        value={firstName}
                        onChange={(e) => {
                            setFirstName(e.target.value)
                        }}
                        label={"Name"}
                        holder={"Sahil"}
                    />
                    <InputField
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value)
                        }}
                        label={"Email"}
                        holder={"sahil@gmail.com"}
                    />
                    <InputField
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                        type={"password"}
                        label={"Password (minimum 8 digit)"}
                        holder={"********"}
                    />
                    <div className="pl-3 mt-4 pr-3">
                        <Button
                            onClick={async () => {
                                if(firstName=="" || username=="" ||password==""){
                                    alert("fill all the credentials")
                                    
                                }
                                else{
                                    setLoading(true)
                                try {
                                    const response = await axios.post("https://dailycode.dailycode.workers.dev/signup", {
                                        name: firstName,
                                        username,
                                        password
                                    })
                                    //console.log(response.data)
                                    localStorage.setItem("autotoken699", response.data.token)
                                    setTodoList(response.data.res.todo);
                                    setInfo({
                                        name:response.data.res.name,
                                        username:response.data.res.username,
                                        id:response.data.res.id
                                        
                                    })
                                    navigate(`/dashboard`)
                                } catch (error) {
                                    console.error("Error during signup", error)
                                } finally {
                                    setLoading(false)
                                }
                                }
                            }}
                            name={"Sign up"}
                        />
                    </div>
                    <div className="pb-2">
                        <BottomWarning warning={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
                    </div>
                </div>
            </div>
        </div>
    )
}
