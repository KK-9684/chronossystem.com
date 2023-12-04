import {
  GET_MEMBERS_REQUEST,
  GET_MEMBERS_SUCCESS,
  GET_MEMBERS_FAILURE,
  ADD_MEMBERS_SUCCESS,
  ADD_MEMBERS_FAILURE,
  UPDATE_MEMBERS_SUCCESS,
  DELETE_MEMBERS_SUCCESS,
} from "../actions/actionType";

export const initialState = {
  members: [],
  totalPages: "",
  latestUid: "",
  isLoading: false,
  isError: false,
};

const memberReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_MEMBERS_REQUEST:
      return { ...state, isLoading: true, isError: false };

    case GET_MEMBERS_SUCCESS:
      return {
        ...state,
        members: payload.result,
        totalPages: payload.totalPages,
        latestUid: payload.latestUid,
        isLoading: false,
        isError: false,
      };

    case GET_MEMBERS_FAILURE:
      return { ...state, isLoading: false, isError: true };
    case ADD_MEMBERS_SUCCESS:
      if (state.members.length === 0) {
        return {
          ...state,
          members: [payload.data],
          latestUid: "",
          isLoading: false,
          isError: false,
        };
      }
      return {
        ...state,
        members: [],
        latestUid: "",
        isLoading: false,
        isError: false,
      };
    case ADD_MEMBERS_FAILURE:
      return { ...state, isLoading: false, isError: true };
    case UPDATE_MEMBERS_SUCCESS:
      return {
        ...state,
        members: [],
        latestUid: "",
        isLoading: false,
        isError: false,
      };
    case DELETE_MEMBERS_SUCCESS:
      return {
        ...state,
        members: [],
        latestUid: "",
        isLoading: false,
        isError: false,
      };

    default:
      return state;
  }
};

export default memberReducer;
