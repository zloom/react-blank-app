import { createReducer } from "typesafe-actions";
import { getVersion } from "./actions";
import { DefaultState } from "./models";

const reducer = createReducer(DefaultState)
  .handleAction(getVersion.success, (s, a) => ({ ...s, version: a.payload }));

export default reducer;
