import { createContext, useContext } from "react";

const TenantContext = createContext({} as any);
export const useTenant = () => useContext(TenantContext);
