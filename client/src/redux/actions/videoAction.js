import axios from "axios";
import * as actionTypes from "./actionType";
import Toast from "toastwind"
import "toastwind/dist/style.css"
import { TokenExpiration } from '../../utils/TokenExpiration';

const {
    GET_VIDEOS_REQUEST,
    GET_VIDEOS_SUCCESS,
    GET_VIDEOS_FAILURE,
    ADD_VIDEOS_SUCCESS,
    UPDATE_VIDEOS_SUCCESS,
    DELETE_VIDEOS_SUCCESS,
} = actionTypes;

const getVideoRequest = () => ({ type: GET_VIDEOS_REQUEST });
const getVideoSuccess = (payload) => ({ type: GET_VIDEOS_SUCCESS, payload });
const getVideoFailure = (payload) => ({ type: GET_VIDEOS_FAILURE, payload });
const addVideoSuccess = (payload) => ({ type: ADD_VIDEOS_SUCCESS, payload });
const updateVideoSuccess = (payload) => ({ type: UPDATE_VIDEOS_SUCCESS, payload });
const deleteVideoSuccess = () => ({ type: DELETE_VIDEOS_SUCCESS });

export const getVideos = (payload, token) => async (dispatch) => {
    TokenExpiration();

    dispatch(getVideoRequest());
    return axios({
        method: "post",
        url: `/videos`,
        data: payload,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    })
    .then((res) => {
        dispatch(getVideoSuccess(res.data));
    })
    .catch((err) => {
        dispatch(getVideoFailure(err));
        Toast.show("動画のリスト取得できませんでした。", {status : 'error'});
    });
};
  
export const addVideos = (payload, token) => async (dispatch) => {
    TokenExpiration();

    return axios({
        method: "post",
        url: `/videos/create_video`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
    })
    .then((res) => {
        dispatch(addVideoSuccess(res.data));
        Toast.show("動画の追加が成功しました!");
    })
    .catch(() => {
        Toast.show("動画の追加できませんでした。", {status : 'error'});
    });
};

export const updateVideos = (id, payload, token) => async (dispatch) => {
    TokenExpiration();

    return axios({
        method: "put",
        url: `/videos/update_video/${id}`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
    })
    .then((res) => {
        dispatch(updateVideoSuccess(res.data));
        Toast.show("動画の更新が成功しました！");
    })
    .catch(() => {
        Toast.show("動画を更新できませんでした。", {status : 'error'});
    });
};
  
export const deleteVideos = (id, token) => async (dispatch) => {
    TokenExpiration();

    return axios({
        method: "delete",
        url: `/videos/delete_video/${id}`,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
    })
    .then(() => {
        dispatch(deleteVideoSuccess());
        Toast.show("動画の削除が成功しました！");
    })
    .catch(() => {
        Toast.show("動画を削除できませんでした。", {status : 'error'});
    });
};
