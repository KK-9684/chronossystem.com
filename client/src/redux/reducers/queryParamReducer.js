import {
    ADD_QUERYPARAM_REQUEST,
} from "../actions/actionType";

export const initialState = {
    page: 1,
    limit: 10,
    sort: "created",
    order: 1,
    isLoading: false,
    isError: false,
};
  
const queryParamReducer = (state = initialState, { type, params }) => {
    switch (type) {
  
        case ADD_QUERYPARAM_REQUEST:
            return {
                ...state,
                page: params.page || state.page,
                limit: params.limit || state.limit,
                sort: params.sort || state.sort,
                order: params.order || state.order,
                isLoading: false,
                isError: false,
            };    
        default:
            return state;
    }
};

export default queryParamReducer;
  