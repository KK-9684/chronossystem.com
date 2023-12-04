import React from 'react';
import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import Toast from "toastwind"
import "toastwind/dist/style.css"
import { jwtDecode } from 'jwt-decode';
import { checkInputField } from '../utils/validator';

const Reset = () => {

    const navigate = useNavigate();
    let { key } = useParams();
    const [isShow, setIsShow] = useState(false);
    const [password, setPassword] = useState({newPassword:'', confirmPassword:''});

    const handleChange = (e) => {
        setPassword({...password, [e.target.name]:e.target.value});
    }

    useEffect(()=>{
        const decodedToken = jwtDecode(key);
        const currentTime = Date.now() / 1000; // Get current time in seconds
        if (decodedToken.exp < currentTime) {
            Toast.show("このリンクは利用できません。", {status: "error"});
            setTimeout(()=>{
                navigate("/", { replace: true });
            }, 2000);
        } else {
            setIsShow(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
   
    const handleOK = () => {
        const valid = checkInputField(password);
        if (valid) {
            Toast.show("すべての入力を挿入する必要があります。", {status: 'error'});
            return;
        }
        if (password.newPassword !== password.confirmPassword) {
            Toast.show("パスワードを正確に登録してください。", {status: "error"});
            return;
        }
        axios
            .post(`/reset_password`, {password:password.newPassword, key: key})
            .then((res) => {
                if (res.status === 201) {
                    navigate("/", { replace: true });
                    Toast.show("パスワードのリセットに成功しました。", {status: 'success'});
                }
            })
            .catch((err) => {
                Toast.show("パスワードのリセットに失敗しました。", {status: 'error'});
            });
    }

    return (
        <>
            <div className='absolute top-5 left-5 text-2xl text-white font-bold'><span>アプリロゴ</span></div>
            <div className='h-[300px] bg-gradient-to-b from-cblue to-white'></div>
            <div className='page-center'>
                {
                    !isShow ? '' :
                    <div className='grid justify-items-center '>
                        <div className='text-xl text-cblue font-bold my-6 text-center'>新しいパスワードを入力してください</div>
                        <div className='grid grid-flow-row w-[350px]'>
                            <input
                                type="password"
                                placeholder='新しいパスワード' 
                                onChange={handleChange}
                                name="newPassword"
                                className='input-login mb-1'
                            ></input>
                            <div className='relative -mt-10 ml-3 w-2 text-gray-500'><i className="fa-solid fa-key text-sm"></i></div>
                            <input
                                type="password"
                                placeholder='新しいパスワード(確認)' 
                                name="confirmPassword"
                                onChange={handleChange} 
                                className='input-login'
                            ></input>
                            <div className='relative -mt-9 ml-3 w-2 text-gray-500'><i className="fa-solid fa-key text-sm"></i></div>
                            <div className='flex flex-row-reverse py-3'>
                                <button className='h-[35px] w-[350px] bg-cblue hover:bg-sky-600 text-white font-bold rounded' onClick={handleOK}>登 録</button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    );
}

export default Reset;