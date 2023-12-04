import {
    GET_PDFS_REQUEST,
    GET_PDFS_SUCCESS,
    GET_PDFS_FAILURE,
    ADD_PDFS_SUCCESS,
    UPDATE_PDFS_SUCCESS,
    DELETE_PDFS_SUCCESS,
} from "../actions/actionType";

export const initialState = {
    pdfs: [],
    totalPages: "",
    latestPid: "",
    isLoading: false,
    isError: false,
};
  
const PDFReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_PDFS_REQUEST:
            return { ...state, isLoading: true, isError: false };
        case GET_PDFS_SUCCESS:
            return {
                ...state,
                pdfs: payload.result,
                totalPages: payload.totalPages,
                latestPid: payload.latestPid,
                isLoading: false,
                isError: false,
            };
        case GET_PDFS_FAILURE:
            return { ...state, isLoading: false, isError: true };
        case ADD_PDFS_SUCCESS:
            if (state.pdfs.length === 0) {
                return { ...state, pdfs: [payload.data], latestPid: "", isLoading: false, isError: false };
            }
            return { ...state, pdfs: [], latestPid: "", isLoading: false, isError: false };
        case UPDATE_PDFS_SUCCESS:
            return { ...state, pdfs: [], latestPid: "", isLoading: false, isError: false };
        case DELETE_PDFS_SUCCESS:
            return { ...state, pdfs: [], latestPid: "", isLoading: false, isError: false };
    
        default:
            return state;
    }
};

export default PDFReducer;
  