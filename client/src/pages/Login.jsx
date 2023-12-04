import React from 'react';
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { loginRequest, loginFailure, loginSuccess } from "../redux/actions/authAction";
import Toast from "toastwind"
import "toastwind/dist/style.css"
import { jwtDecode } from 'jwt-decode';
import { useCookies } from 'react-cookie';
import accessLocal from "../utils/accessLocal";
import { usePWAInstall } from 'react-use-pwa-install'

const Login = () => {
    const [user, setUser] = useState({ email: '', password: '', remember: false });
    const [isPasswordShow, setIsShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);
    const [isRemember, setIsRemember] = useState(cookies.remember);
    
    useEffect(() => {
        const token = accessLocal.loadData('token');
        if (cookies.remember) {
            axios.post("/remember", {remember:cookies.remember}).then((res)=>{
                if (res.status === 200) {
                    setUser({...user, "email": res.data.email, "password": res.data.password});
                }
            });
        }
        if (token) {
            const decodedToken = jwtDecode(token);
            decodedToken.level === "user" ? navigate("/home") : navigate("/muser");
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e) => {
        setUser({...user, [e.target.name]: e.target.value });
    }

    const handleRememberChange = () => {
        setIsRemember((prev) => !prev);
    }

    const forgetPassword = () => {
        navigate("/forget");
    }

    const handleLogin = (e) => {
        dispatch(loginRequest());
        e.preventDefault();
        axios
            .post(`/login`, user)
            .then((res) => {
                if (res.data.token) {
                    let payload = res.data;
                    dispatch(loginSuccess(payload));
                    if (isRemember) {
                        setCookie('remember', payload.user);
                    } else {
                        removeCookie('remember');
                    }
                    const decodedToken = jwtDecode(payload.token);
                    if (decodedToken.level !== "user") {
                        navigate("/muser");
                    } else {
                        navigate("/home");
                    }
                }
            })
            .catch((err) => {
                dispatch(loginFailure());
                if (err.message === "Network Error") {
                    Toast.show("サーバーにアクセスできません。", {status: 'error'});
                    return;
                }
                Toast.show(err.response.data.message, {status: 'error'});
            });
    }

    const install = usePWAInstall();

    return (
        <>
            <div className='absolute top-5 left-5 text-2xl text-white font-bold'><span className=''>クロノス教育株式会社</span></div>
            <div className='text-xl text-white font-bold absolute top-3 right-10'>
                {install && <button onClick={install} className='pwa'>
                    <div className="grid justify-items-center">
                        <i className="fa fa-mobile-screen" ></i>
                        <hr className="bg-white h-[1px] w-[20px] mt-[2px]"></hr>
                        <hr className="bg-white h-[1px] w-[20px] mt-[2px]"></hr>
                    </div>
                </button>}
            </div>
            <div className='h-[300px] bg-gradient-to-b from-cblue to-white'></div>
            <form action='' onSubmit={handleLogin} className='page-center'>
                <div className='grid grid-flow-row p-5'>
                    <div className='text-xl text-cblue font-bold my-3 text-center'>ログイン</div>
                    <input 
                        placeholder='ユーザーID'
                        name='email'
                        value={user.email}
                        onChange={handleChange} 
                        className='input-login'
                    ></input>
                    <div className='relative -mt-9 ml-2 w-2'><i className='fa fa-user'></i></div>
                    <input
                        type={isPasswordShow? 'text' : 'password'}
                        placeholder='パスワード' 
                        name='password'
                        value={user.password}
                        onChange={handleChange} 
                        className='input-login mt-1'
                    ></input>
                    <div className='relative -mt-9 ml-2 w-2'><i className='fa fa-key'></i></div>
                    {
                        isPasswordShow ? 
                        <div className='relative -mt-9 ml-[320px] w-2 text-cblue' onClick={() => setIsShowPassword(false)}><i className='fa fa-eye'></i></div> : 
                        <div className='relative -mt-9 ml-[320px] w-2 text-cblue' onClick={() => setIsShowPassword(true)}><i className='fa fa-eye-slash'></i></div>

                    }
                    <div className='flex justify-between py-3 px-1'>
                        <div className='flex'>
                            <input type="checkbox" className='border-gray-300 h-5 w-5 mr-2' onChange={handleRememberChange} checked={isRemember?true:false}></input>
                            <div className='text-xs'>ログイン保存</div>
                        </div>
                        <div className='text-sm cursor-pointer text-cblue hover:underline' onClick={forgetPassword}>パスワードを忘れた方</div>
                    </div>
                    <div className='flex flex-row-reverse py-3'>
                        <button className='h-[35px] w-[350px] bg-cblue hover:bg-sky-600 text-white font-bold rounded'>ログイン</button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default Login;