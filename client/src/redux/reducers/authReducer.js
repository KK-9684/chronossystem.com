import accessLocal from "../../utils/accessLocal";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_SUCCESS,
} from "../actions/actionType";

const initialState = {
  token: accessLocal.loadData("token") || false,
  isAuthLoading: false,
  isError: false,
};

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isAuthLoading: true,
        isError: false,
      };
    case LOGIN_SUCCESS:
      accessLocal.saveData("token", payload.token);
      return {
        ...state,
        isAuthLoading: false,
        token: payload.token,
        isError: false,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isAuthLoading: false,
        token: null,
        isError: true,
      };
    case LOGOUT_SUCCESS:
      localStorage.clear();
      return {
        ...state,
        isAuthLoading: false,
        token: null,
        isError: true,
      };
    default:
      return state;
  }
};

export default authReducer;