import { useCallback, useState } from "react";

const useHttp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [responseError, setResponseError] = useState("");

    const sendRequest = useCallback(async (url, method = "GET", body = null, headers = {}) => {
        setIsLoading(true);
        try {
            const response = await fetch(url, { method, body, headers })
            const data = await response.json();
            if (!response.ok) {
                const customError = new Error();
                customError.message = data.message;
                throw (customError)
            } else {
                return data;
            }
        } catch (error) {
            console.log(error)
            setResponseError(error.message)
        } finally {
            setIsLoading(false);
        }
    }, [])

    const clearErrors = () => {
        setResponseError(null)
    }

    return { isLoading, responseError, clearErrors, sendRequest }
}

export default useHttp;