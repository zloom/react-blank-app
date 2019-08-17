import { api, http } from "../../shared";
import { requestEpic } from "../../utils/actions";
import { getVersion } from "./actions";

const getVersionEpic = requestEpic(getVersion, () => http.getJsonObservable(api.getVersion));

export { getVersionEpic };
