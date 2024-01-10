import axios from "axios"

const url = "http://127.0.0.1:5000/api"
export function useAuthService(){
    const createUser = (data) => {
        return axios.post(`${url}/users`, data)
    }
    return {
        createUser
    }
}