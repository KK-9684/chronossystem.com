import React from 'react';
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const handleClick = (route) => {
        navigate(route);
    }

    return (
        <div>
            <div className='grid justify-center items-center h-[100vh]'>
                <div className='h-[400px] grid grid-flow-col lg:gap-10 sm:gap-5'>
                    <div className='grid grid-flow-row xl:w-[330px] sm:w-[220px]'>
                        <button className='home-btn text-2xl font-bold text-white h-[300px]' onClick={() => handleClick('/vproblem')}>
                            <div className='grid grid-flow-row -mt-10'>
                                <i className='fa-solid fa-film'></i>
                                <span className='mt-1'>学習動画</span>
                            </div>
                        </button>
                        <div className='block'>
                            <span>重要な知識・解法を授業動画で予習・復習できます。</span>
                        </div>
                    </div>
                    <div className='grid grid-flow-row xl:w-[330px] sm:w-[220px]'>
                        <button className='home-btn text-2xl font-bold text-white h-[300px]' onClick={() => handleClick('/pproblem')}>
                            <div className='grid grid-flow-row -mt-10'>
                                <i className='fa-solid fa-book-open'></i>
                                <span className='mt-1'>解説</span>
                            </div>
                        </button>
                        <div className='block'>
                            <span>問題集を解く・復習するための解説システムです。</span>
                        </div>
                    </div>
                    <div className='grid grid-flow-row xl:w-[330px] sm:w-[220px]'>
                        <button className='home-btn text-2xl font-bold text-white h-[300px]' onClick={() => handleClick('/chat')}>
                            <div className='grid grid-flow-row -mt-10'>
                                <i className='fa-solid fa-comment-dots'></i>
                                <span className='mt-1'>質問</span>
                            </div>
                        </button>
                        <div className='block'>
                            <span>わからないこと・疑問に思ったことを質問できます。</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;