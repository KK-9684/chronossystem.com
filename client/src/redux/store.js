import { configureStore } from '@reduxjs/toolkit';
import memberReducer from "./reducers/memberReducer";
import authReducer from "./reducers/authReducer";
import PDFReducer from "./reducers/PDFReducer";
import videoReducer from "./reducers/videoReducer"
import queryParamReducer from './reducers/queryParamReducer';

const store = configureStore({
  reducer:{
    "authReducer": authReducer,
    "memberReducer": memberReducer,
    "PDFReducer": PDFReducer,
    "videoReducer": videoReducer,
    "queryParamReducer": queryParamReducer,
  }
});

export default store;
