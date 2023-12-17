import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import accessLocal from "../utils/accessLocal";

const data = {
  1: ["正の数と負の数", "式の計算", "方程式", "不等式", "１次関数"],
  2: ["平面図形", "空間図形", "図形の性質と合同", "三角形と四角形"],
  3: [
    "式の計算",
    "平方根",
    "２次方程式",
    "２次関数",
    "データの活用",
    "確率と標本調査",
  ],
  4: ["図形と相似", "線分の比と計量", "円", "三平方の定理"],
};

const Unit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (param) => {
    if (location.pathname.startsWith("/vproblem")) {
      accessLocal.saveData("vunit", param);
      navigate("list");
    } else {
      accessLocal.saveData("unit", param);
      navigate("study");
    }
  };

  const problem = location.pathname.startsWith("/vproblem")
    ? accessLocal.loadData("vproblem")
    : accessLocal.loadData("problem");

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
        <div className="grid grid-cols-2 gap-x-8 gap-y-8">
          {data[problem].map((el, index) => {
            return (
              <div
                key={index}
                className={
                  index === data[problem].length - 1 &&
                  data[problem].length % 2 !== 0
                    ? "col-span-2 flex justify-center"
                    : "col-span-1"
                }
              >
                <button
                  className="lesson-btn w-[330px] h-[163px] shadow-xl rounded-2xl"
                  onClick={() => handleClick(index + 1)}
                >
                  <div className="grid grid-flow-row -mt-10">
                    <div className="text-xl m-3 font-bold text-cblue text-end">
                      第 {index + 1} 章
                    </div>
                    <div className="text-3xl m-3 ml-12 font-bold text-center">
                      {el}
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Unit;
