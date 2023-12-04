import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { addQueryParams } from "../redux/actions/queryParamAction";
import { getMembers, deleteMembers } from "../redux/actions/memberAction";
import Loading from "./Loading";
import Error from "./Error";
import UserModal from "./UserModal";
import DeleteModal from "./DeleteModal";
import SendModal from "./SendModal";
import axios from "axios";
import Toast from "toastwind"
import "toastwind/dist/style.css"
import { TokenExpiration } from '../utils/TokenExpiration';

const _THEAD_ = { uid: "管理番号", email: "ユーザーID", name: "名前", school: "学校名", grade: "学年", level: "アクセス", created: "登録日" };

const UserTable = () => {
  const dispatch = useDispatch();
  const token = useSelector((store) => store.authReducer.token);
  const data = useSelector(store => store.memberReducer.members, shallowEqual);
  const params = useSelector(store => store.queryParamReducer, shallowEqual);
  const [queryParams, setQueryParams] = useState(params);

  useEffect(() => {
    dispatch(getMembers(queryParams, token));
    dispatch(addQueryParams(queryParams, token));
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.page, queryParams.limit, queryParams.sort, queryParams.order, data.length]);

  useEffect(() => {
      setQueryParams(params);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.limit, params.sort, params.order]);

  const handleSortChange = (key) => {
    setQueryParams({...queryParams, sort: key, order: queryParams.order === 1 ? -1 : 1 });
  }

  // Modal state, crud state and selected id
  const [userModalIsOpen, setUserModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [sendModalIsOpen, setSendModalIsOpen] = useState(false);
  const [crudState, setCrudState] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);


  const closeUserModal = () => {
    setUserModalIsOpen(false);
  }

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
  }

  const closeSendModal = () => {
    setSendModalIsOpen(false);
  }

  const handleDelete = (id) => {
    setSelectedId(id);
    setDeleteModalIsOpen(true);
  }

  // Handle edit and delete
  const handleEdit = (id) => {
    setUserModalIsOpen(true);
    const member = data.find((member) => member._id === id);
    setSelectedMember(member);
    setCrudState("update");
  }

  const handleOK = () => {
    dispatch(deleteMembers(selectedId, token));
    closeDeleteModal();
  }

  const handleSendOK = async () => {
    closeSendModal();
    try {
      TokenExpiration();
      await axios({
        method: "post",
        url: `/users/send_reset_link`,
        data: {id:selectedId},
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
      }).then(()=>{
        Toast.show("メッセージ送信成功！");
      });
    } catch (error) {
      Toast.show("メッセージ送信に失敗しました！", {status:'error'});
    }
  }

  const handleSend = async (id) => {
    setSelectedId(id);
    setSendModalIsOpen(true);
  }

  return data.isLoading ? (
    <Loading />
  ) : data.isError ? (
    <Error />
  ) : (
    <>
      <div className="w-full bg-transparent shadow-none flex-col my-3">
        <table className="mt-4 w-full min-w-[1280px] table-auto text-left lg:text-base sm:text-xs">
          <thead>
            <tr>
              {Object.keys(_THEAD_).map((key) => (
                <th
                  key={key}
                  className="border-y border-blue-gray-100 bg-gray-200 p-4"
                >
                  <div
                    className="leading-none opacity-70 font-bold text-gray-800 grid grid-flow-col justify-between"
                  >
                    <span>{_THEAD_[key]}</span>
                    <button onClick={() => handleSortChange(key)}><i className={ queryParams.sort === key ? queryParams.order === 1 ? "fa fa-sort-up" : "fa fa-sort-down" : "fa fa-sort"}></i></button>
                  </div>
                </th>
              ))}
              <th
                key='edit'
                className="border-y border-blue-gray-100 bg-gray-200 p-4"
              >
                <div className="leading-none opacity-70 font-bold text-gray-800 grid grid-flow-col justify-between">
                  <span>編集</span>
                </div>
              </th>
              <th
                key='delete'
                className="border-y border-blue-gray-100 bg-gray-200 p-4"
              >
                <div className="leading-none opacity-70 font-bold text-gray-800 grid grid-flow-col justify-between">
                  <span>削除</span>
                </div>
              </th>
              <th
                key='send'
                className="border-y border-blue-gray-100 bg-gray-200 p-4"
              >
                <div className="leading-none opacity-70 font-bold text-gray-800 grid grid-flow-col justify-between">
                  <span>送信</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map(
              (record, index) => {
                const isLast = index === data.length - 1;
                const classes = isLast
                  ? "p-2"
                  : "p-2 border-b border-blue-gray-50";
 
                return (
                  <tr key={record._id} className="even:bg-gray-50">
                    {
                      Object.keys(_THEAD_).map(key => {
                        return (
                          <td
                            key={key}
                            className={classes}
                          >
                            <div className="leading-none opacity-70 font-bold text-gray-800">
                              {
                                key==="created" ? record[key].split('T')[0] : key==="level" ? record[key]==="user" ? "生徒" : "管理者" : record[key]                          
                              }
                            </div>
                          </td>
                        );
                      },)
                    }
                    <td className={classes}>
                      <button onClick={() => handleEdit(record._id)}><i className="h-4 w-4 fa fa-edit ml-3 text-gray-700" /></button>
                    </td>
                    <td className={classes}>
                      <button onClick={() => handleDelete(record._id)}><i className="h-4 w-4 fa fa-trash-can ml-3 text-gray-700" /></button>
                    </td>
                    <td className={classes}>
                      <button onClick={() => handleSend(record._id)}><i className="h-4 w-4 fa fa-paper-plane ml-3 text-gray-700" /></button>
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </div>
      <UserModal 
        modalIsOpen={userModalIsOpen} 
        crudState={crudState} 
        selectedMember={selectedMember} 
        closeModal={closeUserModal} 
      />
      <DeleteModal modalIsOpen={deleteModalIsOpen} closeModal={closeDeleteModal} handleOK={handleOK}/>
      <SendModal modalIsOpen={sendModalIsOpen} closeModal={closeSendModal} handleOK={handleSendOK}/>
    </>
  );
}

export default UserTable;