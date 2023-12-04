import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useDispatch } from 'react-redux';
import accessLocal from '../utils/accessLocal';
import { logoutSuccess } from "../redux/actions/authAction";

const Manage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const handleClick = (route) => {
        if (route === "/") {
            accessLocal.removeItemFromLocal('user');
            dispatch(logoutSuccess());
        }
        navigate(route);
    }

    return (
        <>
            <div className='grid justify-items-center z-50'>
                <div className='lg:w-[950] md:w-[95%] grid lg:justify-items-center sm:justify-items-end mx-5'>
                    <div className='text-xl text-white font-bold absolute top-3 left-10 z-20'><span>クロノス教育株式会社</span></div>
                    <div className='flex cursor-pointer font-bold'>
                        <div 
                            className={`${location.pathname === "/muser" ? 'active-btn-top' : 'btn-top'} mr-1 rounded-bl-2xl`}
                            onClick={() => handleClick('muser')}
                        >
                            <i className='fa-solid fa-user'></i>
                            <span>ユーザー</span>
                        </div>
                        <div 
                            className={`${location.pathname === "/mvideo" ? 'active-btn-top' : 'btn-top'} mr-1`}
                            onClick={() => handleClick('mvideo')}
                        >
                            <i className='fa-solid fa-film'></i>
                            <span>学習動画</span>
                        </div>
                        <div 
                            className={`${location.pathname === "/mpdf" ? 'active-btn-top' : 'btn-top'} mr-1`}
                            onClick={() => handleClick('mpdf')}
                        >
                            <i className='fa-solid fa-book-open'></i>
                            <span>解説</span>
                        </div>
                        <div 
                            className={`${location.pathname === "/mchat" ? 'active-btn-top' : 'btn-top'} mr-1`}
                            onClick={() => handleClick('mchat')}
                        >
                            <i className="fa-solid fa-comment-dots"></i>
                            <span>質問</span>
                        </div>
                        <div 
                            className='mr-1 rounded-br-2xl btn-top'
                            onClick={() => handleClick('/')}
                        >
                            <i className="fa-solid fa-right-from-bracket"></i>                            
                            <span>ログアウト</span>
                        </div>
                    </div>
                </div>
            </div>
            <Outlet />
        </>
    );
}

export default Manage;