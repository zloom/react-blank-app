import { createReducer } from "typesafe-actions";
import { buyItems, getUser } from "./actions";
import { DefaultState } from "./models";

const reducer = createReducer(DefaultState)
  .handleAction(getUser.success, (s, a) => ({ ...s, currentUser: a.payload }))
  .handleAction(buyItems.success, (s, _) => ({ ...s, shopCart: [] }));

export default reducer;
