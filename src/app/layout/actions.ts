import { User } from "../../shared/models";
import { asyncAction } from "../../utils/actions";
import { BuyRequest, BuyResponse } from "./models";

const getUser = asyncAction<undefined, User>("GET_USER");
const buyItems = asyncAction<BuyRequest, BuyResponse>("BUY_ITEMS");

export { getUser, buyItems };
