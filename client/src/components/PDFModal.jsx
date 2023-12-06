import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Input, Select, Option } from "@material-tailwind/react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { addPDFS, updatePDFS } from "../redux/actions/pdfAction";
import { addQueryParams } from '../redux/actions/queryParamAction';
import { checkInputField } from '../utils/validator';
import { TokenExpiration } from '../utils/TokenExpiration';
import Toast from "toastwind"
import "toastwind/dist/style.css"

const PDFModal = ({ modalIsOpen, crudState, selectedPdf, closeModal }) => {

  const dispatch = useDispatch();
  const token = useSelector((store) => store.authReducer.token);
  const pid = useSelector(store => store.PDFReducer.latestPid);
  const data = useSelector(store => store.PDFReducer.pdfs, shallowEqual);
  const params = useSelector(store => store.queryParamReducer, shallowEqual);
  const [queryParams, setQueryParams] = useState(params);
  // const [url, setUrl] = useState(null);
  const [isShow, setIsShow] = useState(false);
  const [pdf, setPdf] = useState({ problem: '', unit: '', type: '', url: '' });

  useEffect(() => {
    setIsShow(modalIsOpen);
    if (crudState === 'update' && modalIsOpen === true) {
      setPdf({...pdf, problem: selectedPdf.problem, unit: selectedPdf.unit, type: selectedPdf.type, url: selectedPdf.url});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalIsOpen]);

  useEffect(() => {
    dispatch(addQueryParams(queryParams, token));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.sort, queryParams.order]);

  const handleClose = () => {
    closeModal();
    setPdf({ problem: '', unit: '', type: '', url: '' });
    setFile(null);
    fileInputRef.current.value = null;
  };

  const handleOK = async () => {
    const valid = checkInputField(pdf);
    if (valid) {
      Toast.show("すべての入力を挿入する必要があります。", {status: 'error'});
      return;
    }
    let newName = '';
    if (file) {
      if (crudState === 'create') {
        const is_exist = data.some((el) => el.problem === pdf.problem && el.unit === pdf.unit && el.type === pdf.type);
        if (is_exist) {
          Toast.show("PDF はすでに存在します。", {status:'error'});
          return;
        }
      }
      newName = pdf.problem + "-" + pdf.unit + "-" + pdf.type + "-" + Date.now() + ".pdf";
      const formData = new FormData();
      const renamedFile = new File([file], newName, { type: file.type });
      formData.append("file", renamedFile);
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
          "Authorization": `Bearer ${token}`,
        },
      };
      TokenExpiration();
      const result = await axios.post('/pdfs/upload', formData, config);
      if (result.status !== 200) {
        Toast.show("PDFアップロードに失敗しました。", { status: 'error' });
        return;
      }
    }

    if (crudState === 'create') {
      setQueryParams({...queryParams, sort: "created", order: -1});
      dispatch(addPDFS({...pdf, url:newName}, token));
    } else if (crudState === 'update') {
      if (file) {
        dispatch(updatePDFS(selectedPdf._id, { ...pdf, url: newName }, token));
      }
    }   

    handleClose();
  }

  const handleSelectChange1 = (value) => {
    setPdf({ ...pdf, "problem": value, "unit": '' });
  }
  const handleSelectChange2 = (value) => {
    setPdf({ ...pdf, "unit": value });
  }
  const handleSelectChange3 = (value) => {
    setPdf({ ...pdf, "type": value });
  }

  const fileInputRef = useRef(null);

  const openFileSystem = () => {
    fileInputRef.current.click();
  };

  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files.length !== 0){
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setPdf({ ...pdf, "url": selectedFile.name });
    }
  };

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
              <span className='text-2xl font-bold mr-2'>解説PDF</span>
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
                name="pid"
                value={ crudState === "create" ? pid + 1 : selectedPdf? selectedPdf.pid : ''}
                disabled
              />
              <div className="mb-1 mt-3">問題集</div>
              <Select size="lg" name="problem" onChange={handleSelectChange1} value={pdf.problem} className='custom-select' disabled={ crudState === "create" ? false : true }>
                {
                  Array.from({ length: 4 }, (_, index) => (
                    <Option value={`${index + 1}`} key={index + 1}>{index + 1}</Option>
                  ))
                }
              </Select>
              <div className="mb-1 mt-3">単元</div>
              <Select size="lg" name="unit" onChange={handleSelectChange2} value={pdf.unit} className='custom-select' disabled={ crudState === "create" ? pdf.problem === "" ? true: false : true }>
                <Option value="1">1</Option>
                <Option value="2">2</Option>
                <Option value="3">3</Option>
                <Option value="4">4</Option>
                <Option value="5" className={pdf.problem === "1" || pdf.problem === "3" ? '' : 'hidden'}>5</Option>
                <Option value="6" className={pdf.problem === "3" ? '' : 'hidden'}>6</Option>
              </Select>
              <div className="mb-1 mt-3">演習・復習</div>
              <Select size="lg" name="type" onChange={handleSelectChange3} value={pdf.type} className='custom-select' disabled={ crudState === "create" ? false : true }>
                <Option value='1'>演習</Option>
                <Option value='2'>復習</Option>
              </Select>
              <div className='mb-1 mt-3'>アップロードするPDFを選択</div>
              {
                file === null &&  crudState === "create" ? '' :
                <Input
                  size="lg"
                  placeholder=""
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900 cursor-pointer bg-blue-50"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  value={pdf.url}
                  name="url"
                  onClick={openFileSystem}
                  readOnly
                />
              }
              <input
                type="file"
                className='hidden'
                ref={fileInputRef}
                accept="application/pdf"
                onChange={handleFileChange}
              />
              {
                pdf.url ? '' :
                <button className='border-2 border-dashed border-gray-300 rounded h-[45px]' onClick={openFileSystem}><i className='fa fa-plus'></i></button> 
              }
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

export default PDFModal;