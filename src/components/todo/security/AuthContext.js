import { useContext } from "react";
import { createContext, useState } from "react";
import { executeJwtAuthenticationService } from "../api/AuthenticationApiService";
import { apiClient } from "../api/ApiClient";

//1. Create a Context
export const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

// const authContext = useContext(AuthContext)


//2: Share the created context with other componenets

export default function AuthProvider({ children}) {

    const [number] = useState(10)

    const [isAuthenticated, setAuthenticated] = useState(false)

    const [username, setUsername] = useState(null)

    const [token, setToken] = useState(null)


    // function login(username, password) {
    //     if(username==='irfan' && password==='password') {
    //         setAuthenticated(true)
    //         setUsername(username)
    //         return true
    //     }else {
    //         setAuthenticated(false)
    //         setUsername(null)
    //         return false
    //     }

    // }

    // async function login(username, password) {

    //     const baToken = 'Basic ' + window.btoa(username + ":" + password)

    //     try {

    //         const response = await executeBasicAuthenticationService(baToken)

    //         // .then(response => console.log('2: ' + response))
    //         // .catch (error => console.log(error))

    //         if(response.status == 200) {
    //             setAuthenticated(true)
    //             setUsername(username)
    //             setToken(baToken)

    //             apiClient.interceptors.request.use(
    //                 (config) => {
    //                     console.log('intercepting and adding a token')
    //                     config.headers.Authorization = baToken
    //                     return config
    //                 }
    //             )

    //             return true
    //         }else {
    //             logout()
    //             return false
    //         }
    //         }catch(error) {
    //             logout()
    //             return false
    //         }

    // }


    async function login(username, password) {

        try {

            const response = await executeJwtAuthenticationService(username,password)

            // .then(response => console.log('2: ' + response))
            // .catch (error => console.log(error))

            if(response.status === 200) {
                const jwtToken = 'Bearer ' + response.data.token
                setAuthenticated(true)
                setUsername(username)
                setToken(jwtToken)

                apiClient.interceptors.request.use(
                    (config) => {
                        console.log('intercepting and adding a token')
                        config.headers.Authorization = jwtToken 
                        return config
                    }
                )

                return true
            }else {
                logout()
                return false
            }
            }catch(error) {
                logout()
                return false
            }

    }

    function logout() {
        setAuthenticated(false)
        setToken(null)
        setUsername(null)
    }

    return (
        <AuthContext.Provider value={ {number, isAuthenticated, login, logout, username, token} }>
            {children}
        </AuthContext.Provider>
    )
}