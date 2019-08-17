import { routerReducer } from "react-router-redux";
import { Epic } from "redux-observable";
import { ActionType, RootAction, RootState, StateType } from "typesafe-actions";
import * as modules from "./app/modules";

const entries = Object.entries(modules);
const invalidEntries = entries.filter(([a, b]) => !b.reducers || !b.actions || !b.epics);

if (invalidEntries.length > 0) { throw new Error(`Invalid module declaration in ${invalidEntries[0][0]}`); }

interface Router { router: typeof routerReducer; }

export type Reducers = { [P in keyof typeof modules]: typeof modules[P]["reducers"] } & Router;
export type Actions = { [P in keyof typeof modules]: typeof modules[P]["actions"] };

export const rootReducer = entries.reduce((r, [name, val]) => ({ ...r, [name]: val["reducers"] }), {} as Reducers);
export const rootAction = entries.reduce((r, [name, val]) => ({ ...r, [name]: val["actions"] }), {} as Actions);
export const rootEpic = entries.map(([_, val]) => Object.values(val.epics)).reduce((s, i) => [...s, ...i], []);

export type AppEpic = Epic<RootAction, RootAction, RootState>;

declare module "typesafe-actions" {
  export type RootState = StateType<Reducers>;
  export type RootAction = ActionType<Actions>;
  interface Types {
    RootAction: RootAction;
  }
}
