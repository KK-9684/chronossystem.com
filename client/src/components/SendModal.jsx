import React from 'react';

const SendModal = ({ modalIsOpen, closeModal, handleOK}) => {
    return (
        <>
            <div
                className={`${modalIsOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} 
                fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300`}
                onClick={closeModal}
            >
                <div 
                    className="w-[400px] h-[150px] bg-white rounded-xl p-3 transform transition-all duration-300 modal-content shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="h-[35px] flex justify-between">
                        <button
                            className="bg-gray-200 rounded-full h-6 w-6 absolute top-3 right-3 hover:bg-gray-300"
                            onClick={closeModal}
                        >
                            <i className="fa fa-close"></i>
                        </button>
                    </div>
                    {/* Body */}
                    <div className="text-center mt-2">
                        <span className="text-lg font-bold">ユーザーにメールを送信しますか？</span>
                    </div>
                    {/* footer */}
                    <div className="h-[45px] text-center p-4">
                        <button
                            className="h-[30px] w-[100px] bg-gray-400 text-white text-sm font-bold rounded hover:bg-gray-600 mr-2"
                            onClick={closeModal}
                        >
                            <span>いいえ</span>
                        </button>
                        <button
                            className="h-[30px] w-[100px] bg-cblue text-white text-sm font-bold rounded hover:bg-blue-500"
                            onClick={handleOK}
                        >
                            <span>は い</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SendModal;