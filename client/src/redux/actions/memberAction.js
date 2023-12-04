import axios from "axios";
import * as actionTypes from "./actionType";
import Toast from "toastwind"
import "toastwind/dist/style.css"
import { TokenExpiration } from '../../utils/TokenExpiration';

const {
    GET_MEMBERS_REQUEST,
    GET_MEMBERS_SUCCESS,
    GET_MEMBERS_FAILURE,
    ADD_MEMBERS_SUCCESS,
    UPDATE_MEMBERS_SUCCESS,
    DELETE_MEMBERS_SUCCESS,
} = actionTypes;

const getMemberRequest = () => ({ type: GET_MEMBERS_REQUEST });
const getMemberSuccess = (payload) => ({ type: GET_MEMBERS_SUCCESS, payload });
const getMemberFailure = (payload) => ({ type: GET_MEMBERS_FAILURE, payload });

const addMemberSuccess = (payload) => ({ type: ADD_MEMBERS_SUCCESS, payload });
const updateMemberSuccess = (payload) => ({ type: UPDATE_MEMBERS_SUCCESS, payload });
const deleteMemberSuccess = () => ({ type: DELETE_MEMBERS_SUCCESS });

export const getMembers = (payload, token) => async (dispatch) => {
    TokenExpiration();
    dispatch(getMemberRequest());
    return axios({
        method: "post",
        url: `/users`,
        data: payload,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    })
    .then((res) => {
        dispatch(getMemberSuccess(res.data));
    })
    .catch((err) => {
        dispatch(getMemberFailure(err));
        Toast.show("メンバーリストの取得に失敗しました。", {status : 'error'});
    });
};
  
export const addMembers = (payload, token) => async (dispatch) => {
    TokenExpiration();

    return axios({
        method: "post",
        url: `/users/create_user`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
    })
    .then((res) => {
        dispatch(addMemberSuccess(res.data));
        Toast.show("メンバーの追加が成功しました!");
    })
    .catch((err) => {
        Toast.show("メンバーの追加に失敗しました。", {status : 'error'});
    });
};
  
export const updateMembers = (id, payload, token) => async (dispatch) => {
    TokenExpiration();

    return axios({
        method: "put",
        url: `/users/update_user/${id}`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
    })
    .then((res) => {
        dispatch(updateMemberSuccess(res.data));
        Toast.show("メンバーの更新が成功しました!");
    })
    .catch((err) => {
        Toast.show("メンバーの更新に失敗しました。", {status : 'error'});
    });
};
  
export const deleteMembers = (id, token) => async (dispatch) => {
    TokenExpiration();

    return axios({
        method: "delete",
        url: `/users/delete_user/${id}`,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
    })
    .then(() => {
        dispatch(deleteMemberSuccess());
        Toast.show("メンバーの削除が成功しました!");
    })
    .catch((err) => {
        Toast.show("メンバーの削除に失敗しました。");
    });
};
