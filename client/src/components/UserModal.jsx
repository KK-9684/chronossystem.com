import React, { useState, useEffect } from 'react';
import { Input, Select, Option } from "@material-tailwind/react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { addMembers, updateMembers } from "../redux/actions/memberAction";
import { addQueryParams } from '../redux/actions/queryParamAction';
import { checkUserInputField } from '../utils/validator';
import Toast from "toastwind"
import "toastwind/dist/style.css"

const UserModal = ({ modalIsOpen, crudState, selectedMember, closeModal }) => {

  const dispatch = useDispatch();

  const token = useSelector((store) => store.authReducer.token);
  const uid = useSelector(store => store.memberReducer.latestUid);
  const params = useSelector(store => store.queryParamReducer, shallowEqual);
  const [queryParams, setQueryParams] = useState(params);
  const [isShow, setIsShow] = useState(false);
  const [member, setMember] = useState({ name: '', email: '', school: '', grade: '', level: '' });

  useEffect(() => {
    setIsShow(modalIsOpen);
    if (crudState === 'update') {
      setMember({...member, email: selectedMember.email, name: selectedMember.name, school: selectedMember.school, grade:selectedMember.grade,  level: selectedMember.level});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalIsOpen]);

  useEffect(() => {
    dispatch(addQueryParams(queryParams, token));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.sort, queryParams.order]);

  const handleClose = () => {
      closeModal();
      setMember({ email: '', name: '', school: '', grade:'', level: '' });
  };

  const handleOK = () => {
    const valid = checkUserInputField(member);
    if (valid) {
      Toast.show("すべての入力を挿入する必要があります。", {status: 'error'});
      return;
    }
    if (crudState === 'create') {
      setQueryParams({...queryParams, sort: "created", order: -1});
      dispatch(addMembers(member, token));
    } else if (crudState === 'update') {
      dispatch(updateMembers(selectedMember._id, member, token));
    }
    handleClose();
  }

  const handleChange = (e) => {
    let { name, value } = e.target;
    setMember({ ...member, [name]: value });
  }

  const handleLevelChange = (value) => {
    if (value === "manager") {
      setMember({ ...member, "level": value, "school": '', "grade": '' });
      return;
    }
    setMember({ ...member, "level": value });
  }

  const handleGradeChange = (value) => {
    setMember({ ...member, "grade": value });
  }

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
              <span className='text-2xl font-bold mr-2'>ユーザー</span>
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
                name="uid"
                value={ crudState === "create" ? uid + 1 : selectedMember? selectedMember.uid : ''}
                disabled
              />
              <div className="mb-1 mt-3">名前</div>
              <Input
                size="lg"
                placeholder="山田 太郎"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={member.name}
                name="name"
                onChange={handleChange}
                disabled={crudState==="update" ? true : false}
              />
              <div className="mb-1 mt-3">ユーザーID</div>
              <Input
                type="email"
                size="lg"
                placeholder="yamadataro@gmail.com"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={member.email}
                name="email"
                onChange={handleChange}
              />
              <div className="mb-1 mt-3">学校名</div>
              <Input
                size="lg"
                placeholder=""
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={member.school}
                name="school"
                onChange={handleChange}
                disabled = {member.level === "manager" ? true : false}
              />
              <div className="mb-1 mt-3">学年</div>
              <Select size="lg" name="grade" onChange={handleGradeChange} value={member.grade} className='custom-select' disabled = {member.level === "manager" ? true : false}>
                <Option value='中１'>中１</Option>
                <Option value='中２'>中２</Option>
                <Option value='中３'>中３</Option>
              </Select>
              <div className="mb-1 mt-3">メンバータイプ</div>
              <Select size="lg" name="level" onChange={handleLevelChange} value={member.level} className='custom-select'>
                <Option value='user'>生徒</Option>
                <Option value='manager'>管理者</Option>
              </Select>
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

export default UserModal;