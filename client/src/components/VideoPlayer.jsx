import React, { useState, useEffect } from 'react';
// import Player from '@vimeo/player';
import accessLocal from '../utils/accessLocal';
import Player from 'react-player';

const VideoPlayer = () => {

  // const playerRef = useRef();
  const videoId = accessLocal.loadData("list");

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      const maxWidth = Math.floor(Math.min(window.innerWidth, (window.innerHeight) * 1.7777));
      const maxHeight = Math.floor(Math.min(window.innerHeight, window.innerWidth / 1.7777));
      setWidth(Math.floor(maxWidth));
      setHeight(Math.floor(maxHeight));
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
    // eslint-disable-next-line
  }, []);

  // useEffect(() => {
  //   const player = new Player(playerRef.current, {
  //     id: videoId,
  //     width: width,
  //     height: height,
  //     title: false,
  //     byline: false,
  //     autoplay: true,
  //     loop: true,
  //   });

  //   return () => {
  //     player.unload();
  //   };
  //   // eslint-disable-next-line
  // }, [width, height]);

  return (
    <>
      <div className="flex flex-col justify-center rounded-3xl">
        <Player url={`https://vimeo.com/${videoId}`}  width={width} height={height} controls></Player>
        {/* <div ref={playerRef} className='player rounded-3xl'></div> */}
      </div>
    </>
  );
};

export default VideoPlayer;