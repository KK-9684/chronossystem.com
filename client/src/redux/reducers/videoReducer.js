import {
    GET_VIDEOS_REQUEST,
    GET_VIDEOS_SUCCESS,
    GET_VIDEOS_FAILURE,
    ADD_VIDEOS_SUCCESS,
    UPDATE_VIDEOS_SUCCESS,
    DELETE_VIDEOS_SUCCESS,
} from "../actions/actionType";

export const initialState = {
    videos: [],
    totalPages: "",
    latestVid: "",
    isLoading: false,
    isError: false,
};
  
const videoReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_VIDEOS_REQUEST:
            return { ...state, isLoading: true, isError: false };
  
        case GET_VIDEOS_SUCCESS:
            return {
                ...state,
                videos: payload.result,
                totalPages: payload.totalPages,
                latestVid: payload.latestVid,
                isLoading: false,
                isError: false,
            };
  
        case GET_VIDEOS_FAILURE:
            return { ...state, isLoading: false, isError: true };
        case ADD_VIDEOS_SUCCESS:
            if (state.videos.length === 0) {
                return { ...state, videos: [payload.data], latestVid: "", isLoading: false, isError: false };
            }
            return { ...state, videos: [], latestVid: "", isLoading: false, isError: false };
        case UPDATE_VIDEOS_SUCCESS:
            return { ...state, videos: [], latestVid: "", isLoading: false, isError: false };
        case DELETE_VIDEOS_SUCCESS:
            return { ...state, videos: [], latestVid: "", isLoading: false, isError: false };
    
        default:
            return state;
    }
};

export default videoReducer;
  