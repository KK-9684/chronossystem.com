import * as actionTypes from "./actionType";

const {
    ADD_QUERYPARAM_REQUEST,
} = actionTypes;

const addQueryParamRequest = (params) => ({ type: ADD_QUERYPARAM_REQUEST, params });
  
export const addQueryParams = (params) => async (dispatch) => {
    dispatch(addQueryParamRequest(params));
};