import axios from "axios";
import * as actionTypes from "./actionType";
import Toast from "toastwind"
import "toastwind/dist/style.css"
import { TokenExpiration } from '../../utils/TokenExpiration';

const {
    GET_PDFS_REQUEST,
    GET_PDFS_SUCCESS,
    GET_PDFS_FAILURE,
    ADD_PDFS_SUCCESS,
    UPDATE_PDFS_SUCCESS,
    DELETE_PDFS_SUCCESS,
} = actionTypes;

const getPdfRequest = () => ({ type: GET_PDFS_REQUEST });
const getPdfSuccess = (payload) => ({ type: GET_PDFS_SUCCESS, payload });
const getPdfFailure = (payload) => ({ type: GET_PDFS_FAILURE, payload });
const addPdfSuccess = (payload) => ({ type: ADD_PDFS_SUCCESS, payload });
const updatePdfSuccess = (payload) => ({ type: UPDATE_PDFS_SUCCESS, payload });
const deletePdfSuccess = () => ({ type: DELETE_PDFS_SUCCESS });

export const getPDFS = (payload, token) => async (dispatch) => {
    TokenExpiration();
    dispatch(getPdfRequest());
    return axios({
        method: "post",
        url: `/pdfs`,
        data: payload,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    })
    .then((res) => {
        dispatch(getPdfSuccess(res.data));
    })
    .catch((err) => {
        dispatch(getPdfFailure(err));
        Toast.show("PDFリストの取得に失敗しました。", {status : 'error'});
    });
};
  
export const addPDFS = (payload, token) => async (dispatch) => {
    TokenExpiration();

    return axios({
        method: "post",
        url: `/pdfs/create_pdf`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
    })
    .then((res) => {
        dispatch(addPdfSuccess(res.data));
        Toast.show("PDFの追加が成功しました!");
    })
    .catch(() => {
        Toast.show("PDFの追加に失敗しました。", {status : 'error'});
    });
};
  
export const updatePDFS = (id, payload, token) => async (dispatch) => {
    TokenExpiration();

    return axios({
        method: "put",
        url: `/pdfs/update_pdf/${id}`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
    })
    .then((res) => {
        dispatch(updatePdfSuccess(res.data));
        Toast.show("PDFの更新が成功しました。");
    })
    .catch(() => {
        Toast.show("PDFの更新に失敗しました。", {status : 'error'});
    });
};
  
export const deletePDFS = (id, token) => async (dispatch) => {
    TokenExpiration();

    return axios({
        method: "delete",
        url: `/pdfs/delete_pdf/${id}`,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
    })
    .then(() => {
        dispatch(deletePdfSuccess());
        Toast.show("PDFの削除が成功しました。");
    })
    .catch(() => {
        Toast.show("PDFの削除に失敗しました。", {status : 'error'});
    });
};
