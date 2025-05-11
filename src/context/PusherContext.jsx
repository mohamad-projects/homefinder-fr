import { createContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthToken } from "../axios-client";
import { getLocation, index } from "../features/realestate/realEstateSlice";

export const PusherContext = createContext(null);

export const PusherProvider = ({ children }) => {
    const dispatch = useDispatch();
    // const { data } = useSelector((state) => state?.auth?.user);
    // const token = data?.token;

    // useEffect(() => {
    //     if (token) {
    //         setAuthToken(token);
    //     }
    // }, [token]);
    useEffect(() => {
        dispatch(getLocation())
        // dispatch(index())
    }, []);

    return (
        <PusherContext.Provider value={{}}>
            {children}
        </PusherContext.Provider>
    );
};
