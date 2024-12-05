import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { fetchAuthMe, selectorIsAuth } from "../redux/slices/auth";
import { RootState } from "../redux/store";

function RedirectAuthRoute() {
    const dispatch = useDispatch();
    const isAuth = useSelector(selectorIsAuth);
    const userData = useSelector((state: RootState) => state.auth.data);
    const userDataIsLoading = useSelector((state: RootState) => state.auth.status) === "loading";

    useEffect(() => {
        // @ts-ignore
        dispatch(fetchAuthMe());
    }, [dispatch]);


    if (userDataIsLoading) {
        return <div>Loading...</div>;
    }

    if (isAuth) {
        //@ts-ignore
        return <Navigate to={`/user/${userData?._id}`} replace />;
    } else {
        return <Navigate to="/login" replace />;
    }
}

export default RedirectAuthRoute;
