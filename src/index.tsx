import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import { RootAction, RootState } from "typesafe-actions";
import "./index.css";
import Routes from "./routes";
import { rootEpic, rootReducer } from "./types";

const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState>();
const middlewares = [
  epicMiddleware,
];

const store = createStore(combineReducers(rootReducer), {}, compose(applyMiddleware(...middlewares)));
epicMiddleware.run(combineEpics(...rootEpic));

const Root = () => (
  <Provider store={store}>
    <HashRouter>
      <Routes />
    </HashRouter>
  </Provider>
);

render(<Root />, document.getElementById("root"));
