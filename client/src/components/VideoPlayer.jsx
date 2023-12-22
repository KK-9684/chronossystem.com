import React, { useState, useEffect, useRef } from "react";
// import Player from '@vimeo/player';
import accessLocal from "../utils/accessLocal";
import Player from "react-player";

const VideoPlayer = () => {
  const videoId = accessLocal.loadData("list");
  const playerRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  function findClosestCommonMultiple(a, b, target) {
    const lcm = calculateLCM(a, b);
    let closestMultiple = Math.floor(target / lcm) * lcm;
    if (closestMultiple > target) {
      closestMultiple -= lcm;
    }

    return closestMultiple;
  }

  function calculateLCM(a, b) {
    // Calculate the gcd using Euclid's algorithm
    function calculateGCD(a, b) {
      if (b === 0) {
        return a;
      } else {
        return calculateGCD(b, a % b);
      }
    }

    const gcd = calculateGCD(a, b);
    const lcm = (a * b) / gcd;
    return lcm;
  }

  useEffect(() => {
    const updateDimensions = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      let mHeight, mWidth;
      if (screenWidth * 0.5625 >= screenHeight) {
        mHeight = findClosestCommonMultiple(16, 9, screenHeight);
        mWidth = (mHeight * 16) / 9;
      } else {
        mWidth = findClosestCommonMultiple(16, 9, screenWidth);
        mHeight = (mWidth * 9) / 16;
      }

      setWidth(mWidth);
      setHeight(mHeight);
    };

    updateDimensions();

    const handleResize = () => {
      updateDimensions();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVideoEnd = () => {
    playerRef.current.seekTo(0);
    playerRef.current.pause();
  };

  return (
    <>
      <div
        className="flex flex-col justify-center rounded-3xl"
        style={{ width: width, height: height }}
      >
        <Player
          ref={playerRef}
          url={`https://vimeo.com/${videoId}`}
          width="100%"
          height="100%"
          controls
          config={{
            file: {
              attributes: {
                crossOrigin: "true",
              },
            },
            vimeo: {
              playerOptions: {
                quality: "1080p",
              },
            },
          }}
          onEnded={handleVideoEnd}
        ></Player>
      </div>
    </>
  );
};

export default VideoPlayer;
