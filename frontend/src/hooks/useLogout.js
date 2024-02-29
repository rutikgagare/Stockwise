import { useDispatch } from "react-redux"
import { authActions } from "../store/authSlice"
import { organizationActions } from "../store/organizationSlice";

export const useLogout = () => {

    const dispatch = useDispatch();

    const logout = ()=>{
        // remove user from local storage
        localStorage.removeItem('user');

        // dispatch logout action
        dispatch(authActions.logout());

        // dispatch reset org
        dispatch(organizationActions.setOrg(null))
    }

    return {logout};
}