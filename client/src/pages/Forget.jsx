import React from 'react';
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Toast from "toastwind"
import "toastwind/dist/style.css"

const Forget = () => {

    const navigate = useNavigate();
    const [user, serUser] = useState('');

    const handleChange = (e) => {
        serUser(e.target.value);
    }
   
    const handleOK = () => {
        if (user === '' || !user.includes('@')) {
            Toast.show("メールアドレスを正しく入力してください。", {status: "error"});
            return;
        }
        axios
            .post(`/forget_password`, { user:user })
            .then((res) => {
                if (res.status === 201) {
                    navigate("/", { replace: true });
                    Toast.show("メールをご確認ください。 リセットリンクが送信されました。", {status: 'success'});
                }
            })
            .catch((err) => {
                Toast.show("メッセージの送信に失敗しました。 少し待ってから再試行してください。", {status: 'error'});
            });
    }

    const handleCancel = () => {
        navigate("/", { replace: true });
    }

    return (
        <>
            <div className='absolute top-5 left-5 text-2xl text-white font-bold'><span>アプリロゴ</span></div>
            <div className='h-[300px] bg-gradient-to-b from-cblue to-white'></div>
            <div className='page-center'>
                <div className='grid justify-items-center '>
                    <div className='text-xl text-cblue font-bold my-3 text-center'>パスワードをお忘れですか?</div>
                    <div className='py-5'>
                        メールアドレスを入力してください。
                        <br></br>
                        パスワードをリセットするためのリンクを送信します。
                    </div>
                    <div className='grid grid-flow-row w-[350px]'>
                        <input 
                            placeholder='' 
                            onChange={handleChange} 
                            className='input-login'
                        ></input>
                        <div className='relative -mt-9 ml-2 w-2 text-gray-500'><i className="fa-solid fa-envelope"></i></div>
                        <div className='flex flex-row justify-between py-3'>
                            <button className='h-[35px] w-[170px] bg-gray-400 hover:bg-gray-600 text-white font-bold rounded' onClick={handleCancel}>キャンセル</button>
                            <button className='h-[35px] w-[170px] bg-cblue hover:bg-sky-600 text-white font-bold rounded' onClick={handleOK}>送 信</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Forget;