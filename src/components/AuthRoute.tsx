import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import {ReactNode} from "react";
import {RootState} from "../redux/store";
import {useSelector} from "react-redux";
function AuthRoute({ children }: { children: ReactNode }) {
    const authData = useSelector((state: RootState) => state.auth.data);
    if (authData) {
        return children;
    } else {
        return <Navigate replace to="/login" />;
    }
}

export default AuthRoute;
