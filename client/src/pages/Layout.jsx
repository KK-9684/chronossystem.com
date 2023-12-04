import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet  } from "react-router-dom";
import { useDispatch } from 'react-redux';
import accessLocal from '../utils/accessLocal';
import { logoutSuccess } from "../redux/actions/authAction";

const Layout = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [isShow, setIsShow] = useState(false);

    useEffect(() => {
        if (location.pathname === "/pproblem/unit/study/pdf_viewer" || 
            location.pathname === "/vproblem/unit/list/video_player"
        ) {
            setIsShow(false);
        } else {
            setIsShow(true);
        }
    }, [location.pathname]);

    const handleClick = (route) => {
        if (route === "/") {
            accessLocal.removeItemFromLocal('user');
            dispatch(logoutSuccess());
        }
        navigate(route);
    }

    const handleGoBack = () => {
        const lastSlashIndex = location.pathname.lastIndexOf("/");
        const newPath = location.pathname.substring(0, lastSlashIndex);
        if (!newPath.includes("/")) {
          navigate("/home");
          return;
        }
        navigate(newPath);
    };

    return (
        <div className='h-auto'>
            <div className='text-xl text-white font-bold absolute top-3 left-10'>
                { isShow ? <span>クロノス教育株式会社</span> : ''}
            </div>
            <div className='grid grid-flow-row cursor-pointer font-bold absolute bottom-3 right-0 z-40'>
                <div 
                    className={`${location.pathname.startsWith('/vproblem') ? 'active-btn-bottom' : 'btn-bottom'} mb-[1px] rounded-tl-lg`}
                    onClick={() => handleClick('/vproblem')}
                >
                    <i className='fa-solid fa-film'></i>
                    <span>学習動画</span>
                </div>
                <div 
                    className={`${location.pathname.startsWith('/pproblem') ? 'active-btn-bottom' : 'btn-bottom'} mb-[1px]`}
                    onClick={() => handleClick('/pproblem')}
                >
                    <i className='fa-solid fa-book-open'></i>
                    <span>解説</span>
                </div>
                <div 
                    className={`${location.pathname.startsWith('/chat') ? 'active-btn-bottom' : 'btn-bottom'} mb-[1px]`}
                    onClick={() => handleClick('/chat')}
                >
                    <i className="fa-solid fa-comment-dots"></i>
                    <span>質問</span>
                </div>
                <div 
                    className='mb-5 rounded-bl-lg btn-bottom'
                    onClick={() => handleClick('/')}
                >
                    <i className="fa-solid fa-right-from-bracket"></i> 
                    <span className='text-[10px]'>ログアウト</span>                       
                </div>
                <div 
                    className='rounded-l-lg btn-bottom'
                    onClick={handleGoBack}
                >
                    <i className="fa-solid fa-left-long"></i>                            
                    <span>戻る</span>
                </div>
            </div>
            <Outlet />
            {/* <NotificationContainer /> */}
        </div>
    );
}

export default Layout;