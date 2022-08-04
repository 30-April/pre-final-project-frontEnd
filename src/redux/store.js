import { combineReducers, applyMiddleware } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import auth_reducer from "./reducers/auth";
import thunk from "redux-thunk";
import render_reducer from "./reducers/render"

const rootReducer = combineReducers({
  auth: auth_reducer, // si auth disini adalah key untuk memanggil si auth_reducer
  render: render_reducer, // auto render
});

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
});

//middleware ? action => reducer. action => function
// action => dispatch => mengubah state

// const store = configureStore({
//   reducer: rootReducer,
// });

export default store;
