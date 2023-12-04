import React, { useState, useEffect } from 'react';
import VideoTable from '../components/VideoTable'
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { addQueryParams } from "../redux/actions/queryParamAction";
import VideoModal from "../components/VideoModal";

const Mvideo = () => {
    const dispatch = useDispatch();
    const token = useSelector(store => store.authReducer.token);
    const params = useSelector(store => store.queryParamReducer, shallowEqual);
    const [queryParams, setQueryParams] = useState(
        {page: 1, limit: 10, sort: "created", order: -1}
    );
    const videoData = useSelector((store) => store.videoReducer);

    useEffect(() => {
        dispatch(addQueryParams(queryParams, token));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryParams]);

    useEffect(() => {
        setQueryParams(params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    const handlePagePrev = () => {
        if (queryParams.page > 1) {
            const newPage = queryParams.page - 1;
            setQueryParams({ ...queryParams, page: newPage });
        }
    };

    const handlePageNext = () => {
        if (queryParams.page < videoData.totalPages) {
            const newPage = queryParams.page + 1;
            setQueryParams({ ...queryParams, page: newPage });
        }
    };

    const handleLimitChange = (e) => {
        const newLimit = e.target.value;
        setQueryParams({...queryParams, limit: newLimit });
    };

    // User Modal Open and Close
    const [userVideoIsOpen, setVideoModalIsOpen] = useState(false);
    const [crudState, setCrudState] = useState('');

    const openVideoModal = () => {
        setCrudState('create');
        setVideoModalIsOpen(true);
    };

    const closeVideoModal = () => {
        setVideoModalIsOpen(false);
    };

    return (
        <>
            <div className='grid justify-items-center'>
                <div className='lg:w-[950] md:w-[95%]'>
                    <div className="rounded-none bg-transparent">
                        <div className='lg:w-[950] md:w-[95%] grid grid-flow-col bg-transparent'>
                            <div className='mt-10 mb-5 mx-5 flex items-end'>
                                <div className='text-3xl text-gray-900 font-bold mr-5'><span>学習動画管理</span></div>
                                <button
                                    className='btn-add'
                                    onClick={openVideoModal}
                                >
                                    <span>新規登録</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="grid grid-flow-col gap-2 items-center">
                                <span>表示 :</span>
                                <select className="w-[100px] h-[35px] border-2 border-cblue px-3 rounded-md" onChange={handleLimitChange}>
                                    <option value='10'>10件</option>
                                    <option value='20'>20件</option>
                                    <option value='30'>30件</option>
                                    <option value='50'>50件</option>
                                    <option value='100'>100件</option>
                                </select>
                            </div>
                            <div className="grid justify-items-end grid-flow-col items-center hidden">
                                <span className="p-2">検索 :</span>
                                <input type='text' className="h-[35px] w-[200px] border-2 border-cblue px-3 rounded-md active:border-cblue"></input>
                            </div>
                        </div>
                    </div>
                    <VideoTable />
                    <div className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                        <div>
                            {queryParams.page } / {videoData.totalPages}
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="py-1 px-3 border-[1px] border-gray-500 hover:bg-gray-200 rounded-md font-bold"
                                name='prev'
                                onClick={handlePagePrev}
                            >
                                <i className="fa fa-angle-left"></i>
                            </button>
                            <button
                                className="py-1 px-3 border-[1px] border-gray-500 hover:bg-gray-200 rounded-md font-bold"
                                name='next'
                                onClick={handlePageNext}
                           >
                                <i className="fa fa-angle-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <VideoModal 
                modalIsOpen={userVideoIsOpen} 
                crudState={crudState} 
                closeModal={closeVideoModal}
            />
        </>
    );
};

export default Mvideo;