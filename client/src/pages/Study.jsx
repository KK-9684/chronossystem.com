import React from "react";
import { useNavigate } from "react-router-dom";
import accessLocal from "../utils/accessLocal";
import { useSelector } from "react-redux";
import axios from "axios";
import Toast from "toastwind";
import "toastwind/dist/style.css";
import { TokenExpiration } from "../utils/TokenExpiration";

const Study = () => {
  const navigate = useNavigate();
  const token = useSelector((store) => store.authReducer.token);

  const handleClick = async (param) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      TokenExpiration();

      const res = await axios.post(
        "/pdfs/get_pdf",
        {
          problem: accessLocal.loadData("problem"),
          unit: accessLocal.loadData("unit"),
          type: param,
        },
        config
      );
      if (res.data.result.url) {
        accessLocal.saveData("study", param);
        navigate("pdf_viewer");
      }
    } catch (error) {
      Toast.show("PDFは存在しません。", { status: "error" });
    }
  };

  return (
    <div>
      <div className="grid justify-center items-end h-[15vh]">
        <span className="text-cblue font-bold text-3xl">解説システム</span>
      </div>
      <div className="grid justify-center items-center h-[85vh]">
        <div className="h-[300px] grid grid-cols-2 gap-10">
          <div className="grid grid-flow-row xl:w-[450px] sm:w-[330px]">
            <button
              className="lesson-btn text-2xl font-bold xl:h-[222px] sm:h-[163px] shadow-lg rounded-3xl"
              onClick={() => handleClick("1")}
            >
              <div className="grid grid-flow-row -mt-5">
                <span className="text-3xl">演習システム</span>
              </div>
            </button>
            <div className="text-center">
              <span>
                段階ヒントつきの解説システムです。１周目を解くときなどはこちら！
              </span>
            </div>
          </div>
          <div className="grid grid-flow-row xl:w-[450px] sm:w-[330px]">
            <button
              className="lesson-btn text-2xl font-bold xl:h-[220px] sm:h-[163px] shadow-lg rounded-3xl"
              onClick={() => handleClick("2")}
            >
              <div className="grid grid-flow-row -mt-5">
                <span className="text-3xl">復習システム</span>
              </div>
            </button>
            <div className="text-center">
              <span>
                ヒントなし・重要問題のみで、最短時間で復習できるシステムです。
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Study;
