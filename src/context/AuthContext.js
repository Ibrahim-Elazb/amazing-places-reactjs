// @ts-nocheck
import { createContext, useCallback, useEffect, useRef, useState } from "react";

export const AuthContext = createContext({ isLogin: false, token: null, id: null, logInHandler: () => { }, logOutHandler: () => { } });

const AuthContextProvider = (props) => {

    const [isLogin, setIslogin] = useState(false);
    const [token, setToken] = useState();
    const [id, setId] = useState();
    const [expirationToken, setExpirationToken] = useState();
    let logOutTimer=useRef();

    const logInHandler = useCallback((token, id, expiration) => {
        setIslogin(true);
        setToken(token);
        setId(id)
        const tokenExpire = expiration || new Date(new Date().getTime() + 3600000)
        setExpirationToken(tokenExpire)
        localStorage.setItem("userData",
            JSON.stringify({ id, token, expiration: tokenExpire.toISOString() }))
    }, [])

    const logOutHandler = useCallback(() => {
        setIslogin(false)
        setToken(null)
        setId(null)
        setExpirationToken(null)
        localStorage.removeItem("userData")
    }, [])

    //auto-login on app start-up
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData"))
        if (userData?.token && new Date(userData.expiration) > new Date()) {
            logInHandler(userData.token, userData.id, new Date(userData.expiration))
        }
    }, [logInHandler])


    //add timeout to automatically logout after expiration
    useEffect(()=>{
        if(token&&expirationToken){
            logOutTimer.current=setTimeout(logOutHandler,expirationToken?.getTime()-new Date().getTime());
        }
        return ()=>{
            if(logOutTimer.current)clearTimeout(logOutTimer.current)
        }
    },[token, expirationToken, logOutHandler])

    const contextValue = { isLogin, token, id, logInHandler, logOutHandler };

    return (<AuthContext.Provider value={contextValue}>
        {props.children}
    </AuthContext.Provider>)
}

export default AuthContextProvider;