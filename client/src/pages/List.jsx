import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import accessLocal from "../utils/accessLocal";
import Thumbnail from "../components/Thumbnail";
// import VideoPlayer from '../components/VideoPlayer';
// import Player from 'react-player';
import axios from "axios";
import Toast from "toastwind";
import "toastwind/dist/style.css";
import { TokenExpiration } from "../utils/TokenExpiration";

const List = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const token = useSelector((store) => store.authReducer.token);

  useEffect(() => {
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    TokenExpiration();
    axios
      .post(
        "/videos/get_video_list",
        {
          problem: accessLocal.loadData("vproblem"),
          unit: accessLocal.loadData("vunit"),
        },
        config
      )
      .then((res) => {
        setData(res.data.result);
        if (res.data.result.length === 0) {
          Toast.show("動画ファイルが追加されていません。", { status: "error" });
        }
      })
      .catch(() => {
        Toast.show("問題が発生しました。後でもう一度お試しください。", {
          status: "error",
        });
      });
    // eslint-disable-next-line
  }, []);

  // eslint-disable-next-line
  const handleClick = (param) => {
    accessLocal.saveData("list", param);
    navigate("video_player");
  };

  const [width, setWidth] = useState(0);
  const [sWidth, setsWidth] = useState(0);
  const [xWidth, setxWidth] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      const maxWidth = window.innerWidth;
      setWidth(Math.floor(maxWidth));
      setsWidth(Math.floor(maxWidth / 4.5));
      setxWidth(Math.floor(maxWidth / 3.5));
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <div className="grid justify-center items-end h-[15vh]">
        <span className="text-cblue font-bold text-3xl">学習動画</span>
      </div>
      <div className="grid justify-center">
        <div
          className={`${
            width > 1280 ? "grid-cols-4" : "grid-cols-3"
          } grid gap-8 mt-20 h-[200px] overscroll-auto`}
        >
          {data.length === 0
            ? ""
            : data.map((el, index) => {
                return (
                  <div
                    key={index}
                    className="grid grid-flow-row justify-items-center z-10"
                  >
                    {/* <VideoPlayer videoId={videoId} num={4} /> */}
                    <div
                      className="rounded-xl cursor-pointer"
                      onClick={() => handleClick(el.vimeoID)}
                    >
                      <Thumbnail
                        param={el.vimeoID}
                        width={width > 1280 ? sWidth : xWidth}
                      ></Thumbnail>
                      {/* <Player url={`https://vimeo.com/${el.vimeoID}`} className="z-0" width={width > 1280 ? sWidth: xWidth} height={width > 1280 ? sHeight: xHeight} thumbnail="false"/> */}
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default List;
