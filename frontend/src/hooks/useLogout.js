import { useDispatch } from "react-redux"
import { authActions } from "../store/authSlice"

export const useLogout = () => {

    const dispatch = useDispatch();

    const logout = ()=>{
        // remove user from local storage
        localStorage.removeItem('user');

        // dispatch logout action
        dispatch(authActions.logout());
    }

    return {logout};
}