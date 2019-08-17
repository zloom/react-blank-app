import { User } from "../../shared/models";

export interface BuyRequest {
  items: string[];
}

export interface BuyResponse {
  status: boolean;
}

export interface LayoutState {
  currentUser: User;
  shopCart: string[];
}

export const DefaultState: LayoutState = {
  currentUser: null,
  shopCart: [],
};
