import React, { useState, useEffect, useRef } from 'react';
import { Input, Select, Option } from "@material-tailwind/react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { addVideos, updateVideos } from "../redux/actions/videoAction";
import { addQueryParams } from '../redux/actions/queryParamAction';
import axios from 'axios';
import * as tus from 'tus-js-client';
import Toast from "toastwind";
import "toastwind/dist/style.css";
import { checkInputField } from '../utils/validator';
import { TokenExpiration } from '../utils/TokenExpiration';

const VideoModal = ({ modalIsOpen, crudState, selectedVideo, closeModal }) => {

  const dispatch = useDispatch();
  const token = useSelector((store) => store.authReducer.token);
  const data = useSelector(store => store.videoReducer.videos);
  const vid = useSelector(store => store.videoReducer.latestVid);
  const params = useSelector(store => store.queryParamReducer, shallowEqual);
  const [queryParams, setQueryParams] = useState(params);
  // const [url, setUrl] = useState(null);
  const [isShow, setIsShow] = useState(false);
  const [video, setVideo] = useState({ problem: '', unit: '', vno: '', url: '', vimeoID:'' });
  const [isUpload, setIsUpload] = useState(false);

  useEffect(() => {
    setIsShow(modalIsOpen);
    if (crudState === 'update' && !isUpload) {
      setVideo({...video, problem: selectedVideo.problem, unit: selectedVideo.unit, vno: selectedVideo.vno, url: selectedVideo.url, vimeoID: selectedVideo.vimeoID});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalIsOpen]);

  useEffect(() => {
    dispatch(addQueryParams(queryParams, token));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.sort, queryParams.order]);

  const handleClose = () => {
    closeModal();
    setVideo({ problem: '', unit: '', vno: '', url: '', vimeoID:'' });
    setFile(null);
    fileInputRef.current.value = null;
  };

  const handleOK = async () => {

    const valid = checkInputField(video);
    if (valid) {
      Toast.show("すべての入力を挿入する必要があります。", {status: 'error'});
      return;
    }

    let videoMeta = null;

    if (file) {

      if (crudState === "create") {
        const is_exist = data.some((el) => el.problem === video.problem && el.unit === video.unit && el.vno === video.vno);
        if (is_exist) {
          Toast.show("動画はすでに存在します。", {status:'error'});
          return;
        }
      }
      setProgress(0);
      setUploading(true);
      videoMeta = await videoUploader(
        file,
        (bytesUploaded, bytesTotal) => {
          setProgress((bytesUploaded * 100) / bytesTotal);
        }
      );
      setUploading(false);
      if (!Object.keys(videoMeta).includes('id')) {
        Toast.show("動画のアップロードに失敗しました!", {status:'error'});
        return;
      }
    } else {
      if (crudState === "update" && selectedVideo.vno !== video.vno) {
        dispatch(updateVideos(selectedVideo._id, video, token));
      }
    }

    handleClose();
  }

  useEffect(() => {
    setIsUpload(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video]);

  const handleSelectChange1 = (value) => {
    setVideo({ ...video, "problem": value, value, "unit": '' });
  }

  const handleSelectChange2 = (value) => {
    setVideo({ ...video, "unit": value });
  }

  const handleSelectChange3 = (value) => {
    setVideo({ ...video, "vno": value });
  }

  // -------------vimeo--------------

  const fileInputRef = useRef(null);

  const openFileSystem = () => {
    fileInputRef.current.click();
  };

  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    if (event.target.files.length !== 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setVideo({ ...video, "url": selectedFile.name });
    }
  };

  const videoUploader = async (file, onProgress) => {
    try {
      const config = {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }      
      
      TokenExpiration();

      const presignedLinkResponse = await axios.post(
        '/videos/upload_video', 
        { size: file.size, name: file.name, id:selectedVideo ? selectedVideo._id : null },
        config
      );

      const uploadURI = presignedLinkResponse.data.upload.upload_link;
      const vimeoVideoLink = presignedLinkResponse.data.uri;
      const vimeoId = vimeoVideoLink.split('/').slice(-1)[0];

      if (crudState === 'create') {
        setQueryParams({...queryParams, sort: "created", order: -1});
        dispatch(addVideos({...video, vimeoID:vimeoId}, token));
      } else if (crudState === 'update') {
        if (file) {
          dispatch(updateVideos(selectedVideo._id, {...video, vimeoID:vimeoId}, token));
        }
      }

      return new Promise((resolve, reject) => {
        const uploader = new tus.Upload(file, {
          uploadUrl: uploadURI,
          onError: (error) => {
            reject(error);
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            onProgress?.(bytesUploaded, bytesTotal);
          },
          onSuccess: () => {
            resolve({
              provider: 'VIMEO',
              id: vimeoId,
            });
          },
        });
        uploader.start();
      });
    } catch (error) {
      return error;
    }
  };

// ---------------------------------------------------------------------------------------------------
  return (
    <>
      <div
        className={`${isShow ? 'opacity-100' : 'opacity-0 pointer-events-none'} 
        fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300`}
        onClick={handleClose}
      >
        <div 
          className="w-[400px] bg-white rounded-xl p-3 transform transition-all duration-300 modal-content shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="h-[35px] flex justify-between">
            <button
              className="bg-gray-200 rounded-full h-6 w-6 absolute top-3 right-3 hover:bg-gray-300"
              onClick={handleClose}
            >
              <i className="fa fa-close"></i>
            </button>
            <div className='grid grid-flow-col items-end px-3'>
              <span className='text-2xl font-bold mr-2'>学習動画</span>
              <span> {crudState === "create" ? '新規登録' : '編集'}</span>
            </div>
          </div>
          {/* Body */}
          <div className="pt-3 px-6">
            <div className="mb-1 flex flex-col">
              <div className="mb-1">管理番号</div>
              <Input
                size="lg"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                name="vid"
                value={ crudState === "create" ? vid + 1 : selectedVideo? selectedVideo.vid : ''}
                disabled
              />
              <div className="mb-1 mt-3">問題集</div>
              <Select size="lg" name="problem" onChange={handleSelectChange1} value={video.problem} className='custom-select' disabled={crudState === "create" ? false : true}>
                {
                  Array.from({ length: 4 }, (_, index) => (
                    <Option value={`${index + 1}`} key={index + 1}>{index + 1}</Option>
                  ))
                }
              </Select>
              <div className="mb-1 mt-3">単元</div>
              <Select size="lg" name="unit" onChange={handleSelectChange2} value={video.unit} className='custom-select' disabled={crudState === "create" ? video.problem === "" ? true: false : true}>
                <Option value="1">1</Option>
                <Option value="2">2</Option>
                <Option value="3">3</Option>
                <Option value="4">4</Option>
                <Option value="5" className={video.problem === "1" || video.problem === "3" ? '' : 'hidden'}>5</Option>
                <Option value="6" className={video.problem === "3" ? '' : 'hidden'}>6</Option>
              </Select>
              <div className="mb-1 mt-3">動画番号</div>
              <Select size="lg" name="vno" onChange={handleSelectChange3} value={video.vno} className='custom-select'>
                {
                  Array.from({ length: 20 }, (_, index) => (
                    <Option value={`${index + 1}`} key={index + 1}>{index + 1}</Option>
                  ))
                }
              </Select>
              <div className="mb-1 mt-3">アップロードする動画を選択</div>
              {
                file === null && crudState === "create" ? '' :
                <Input
                  size="lg"
                  placeholder=""
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900 cursor-pointer bg-blue-50"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  value={video.url}
                  name="url"
                  onClick={openFileSystem}
                  readOnly
                />
              }
              <input
                type="file"
                className='hidden'
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              {
                video.url ? '' :
                <button className='border-2 border-dashed border-gray-300 rounded h-[45px]' onClick={openFileSystem}><i className='fa fa-plus'></i></button> 
              }
              {isUploading && <div>処理 {Math.floor(progress)}%</div>}
            </div>
          </div>
          {/* footer */}
          <div className="h-[50px] text-end pt-3 mx-6">
            <button
              className="h-[30px] w-[100px] bg-gray-400 text-white text-sm font-bold rounded hover:bg-gray-600 mr-2"
              onClick={handleClose}
            >
              <span>キャンセル</span>
            </button>
            <button
              className="h-[30px] w-[100px] bg-cblue text-white text-sm font-bold rounded hover:bg-blue-500"
              onClick={handleOK}
            >
              <span>保 存</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoModal;