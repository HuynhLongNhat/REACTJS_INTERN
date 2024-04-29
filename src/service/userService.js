
import axios from "../service/axios"
const fetchAllUser = (page) => {
    return axios.get(`users?page=${page}`);

}
const AddNewUser = (data) => {
    return axios.post('users', data)
}

const UpdateUser = (name, job) => {
    return axios.put('users/', { name, job })
}

const deleteUser = (id) => {
    return axios.delete(`users/${id}`)
}

const loginApi = (email, password) => {
    return axios.post("login", { email, password })
}
export { fetchAllUser, AddNewUser, UpdateUser, deleteUser, loginApi }