import { asyncAction } from "../../utils/actions";
import { Version } from "./models";

const getVersion = asyncAction<undefined, Version>("GET_VERSION");

export { getVersion };
