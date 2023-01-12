import { createContext } from "react";
import { AccountStore } from "./AccountStore";

export const rootStoreContext = createContext({
    accountStore: new AccountStore(),
});
