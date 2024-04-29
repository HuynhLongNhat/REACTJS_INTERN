import { useEffect, useState, useContext } from "react";
import { loginApi } from "../service/userService"
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from './UserContext'
const Login = () => {
    const { loginContext } = useContext(UserContext)
    const navigation = useNavigate()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isLoadingAPI, setLoadingAPI] = useState(false)

    // useEffect(() => {
    //     let token = localStorage.getItem("token")
    //     if (token) {
    //         navigation('/')
    //     }

    // },)
    const handleLogin = async () => {
        if (!email || !password) {
            toast.error("Email/Password is required!")
            return
        }
        setLoadingAPI(true)
        let res = await loginApi(email.trim(), password)
        if (res.token) {
            loginContext(email, res.token)
            navigation('/')
            toast.success("Login success!")
            setLoadingAPI(false)
            setEmail("");
            setPassword('')
        }
        else {
            if (res && res.status === 400) {
                setLoadingAPI(false)
                setEmail("");
                setPassword('')
                toast.error(res.data.error)
            }
        }
    }
    const handleGoBack = () => {
        navigation("/")
    }
    const handlePressEnter = async (event) => {
        if (event && event.key === "Enter") {
            await handleLogin()
        }
    }
    return (<div className="login-container title col-12 col-sm-4">
        <div className="title">
            Login
        </div>
        <div className="text my-3">
            Email or username ( eve.holt@reqres.in )
        </div>
        <input
            className="form-control px-2"
            type="text"
            placeholder="Email or username..."
            value={email}
            onChange={(event) => setEmail(event.target.value)} />
        <div className="input-password">

            <input
                className="form-control my-3 px-2 "
                type={isShowPassword ? "text" : "password"}
                placeholder="Password..."
                value={[password]}
                onChange={(event) => setPassword(event.target.value)}
                onKeyDown={(event) => handlePressEnter(event)}
            />

            <i onClick={() => setIsShowPassword(!isShowPassword)} className={isShowPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>

        </div>
        <button className={email && password ? "btn btn-success my-3" : "btn btn-light my-3  "}
            disabled={email && password ? false : true}
            onClick={() => handleLogin()}
        >
            {isLoadingAPI ? <i className="fa-solid fa-sync fa-spin"></i> : "Login"} </button>
        <div className="back my-3">
            <i className="fa-solid fa-angles-left"></i>
            <span onClick={() => handleGoBack()} >Go back</span>
        </div>
    </div >);
}

export default Login;