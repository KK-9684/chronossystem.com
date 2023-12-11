import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import accessLocal from "../utils/accessLocal";

const Problem = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (param) => {
    if (location.pathname.startsWith("/vproblem")) {
      accessLocal.saveData("vproblem", param);
    } else {
      accessLocal.saveData("problem", param);
    }
    navigate("unit");
  };

  return (
    <div>
      <div className="grid justify-center items-end h-[15vh]">
        {location.pathname.startsWith("/vproblem") ? (
          <span className="text-cblue font-bold text-3xl">学習動画</span>
        ) : (
          <span className="text-cblue font-bold text-3xl">解説システム</span>
        )}
      </div>
      <div className="grid justify-center items-center h-[85vh]">
        <div className="grid grid-cols-2 gap-x-8 gap-y-16">
          <button
            className="lesson-btn w-[330px] h-[163px] shadow-xl rounded-2xl"
            onClick={() => handleClick(1)}
          >
            <div className="grid grid-flow-row justify-items-end -mt-10">
              <div className="text-xl m-3 font-bold text-cblue">
                体系問題集 数学１
              </div>
              <div className="text-4xl m-3 mr-10 font-bold ">代数編 発展</div>
            </div>
          </button>
          <button
            className="lesson-btn w-[330px] h-[163px] shadow-xl rounded-2xl"
            onClick={() => handleClick(2)}
          >
            <div className="grid grid-flow-row justify-items-end -mt-10">
              <div className="text-xl m-3 font-bold text-cblue">
                体系問題集 数学１
              </div>
              <div className="text-4xl m-3 mr-10 font-bold ">幾何編 発展</div>
            </div>
          </button>
          <button
            className="lesson-btn w-[330px] h-[163px] shadow-xl rounded-2xl"
            onClick={() => handleClick(3)}
          >
            <div className="grid grid-flow-row justify-items-end -mt-10">
              <div className="text-xl m-3 font-bold text-cblue">
                体系問題集 数学２
              </div>
              <div className="text-4xl m-3 mr-10 font-bold ">代数編 発展</div>
            </div>
          </button>
          <button
            className="lesson-btn w-[330px] h-[163px] shadow-xl rounded-2xl"
            onClick={() => handleClick(4)}
          >
            <div className="grid grid-flow-row justify-items-end -mt-10">
              <div className="text-xl m-3 font-bold text-cblue">
                体系問題集 数学２
              </div>
              <div className="text-4xl m-3 mr-10 font-bold ">幾何編 発展</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Problem;
