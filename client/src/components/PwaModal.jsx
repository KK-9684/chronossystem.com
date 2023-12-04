import React from "react";

const PwaModal = ({ modalIsOpen, closeModal, okModal, data }) => {
  return (
    <>
      {modalIsOpen ? (
        <div className="fixed inset-0 flex justify-center pt-20 transition-opacity duration-300">
          <div
            className={`w-[300px] bg-black rounded-xl p-3 transform transition-all duration-300 modal-content shadow-lg ${
              data.title === "オンライン" ? "h-[150px]" : "h-[100px]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="h-[35px] flex justify-between text-white font-bold p-2">
              <div>{data.title}</div>
              <button
                className="text-white h-6 w-6 text-lg absolute top-3 right-3 hover:text-gray-300"
                onClick={closeModal}
              >
                ×
              </button>
            </div>
            <div className="text-center">
              <div className="text-white mt-2">
                <span className="text-lg">{data.message}</span>
              </div>
              {data.title === "オンライン" ? (
                <div className="p-4">
                  <button
                    className="h-[30px] w-[100px] bg-gray-200 text-sm font-bold rounded hover:bg-gray-500"
                    onClick={okModal}
                  >
                    <span>リロード</span>
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default PwaModal;
