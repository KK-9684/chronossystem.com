import React from 'react';
import VideoPlayer from '../components/VideoPlayer';

const Vplayer = () => {

    return (
        <div className='bg-black w-[100vw] h-[100vh]'>
            <div className='page-center'>
                <VideoPlayer />
            </div>
        </div>
    );
};

export default Vplayer;