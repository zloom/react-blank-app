import { api, http } from "../../shared";
import { requestEpic } from "../../utils/actions";
import { getUser } from "./actions";

const getUserEpic = requestEpic(getUser, () => http.getJsonObservable(api.getUser));

export { getUserEpic };
