import { useDispatch } from "react-redux"
import { authActions } from "../store/authSlice"
import { organizationActions } from "../store/organizationSlice";
import { inventoryActions } from "../store/inventorySlice";
import { ticketActions } from "../store/ticketSlice";
import { ticketAdminActions } from "../store/ticketAdminSlice";
import { categoryActions } from "../store/categorySlice";

export const useLogout = () => {

    const dispatch = useDispatch();

    const logout = ()=>{
        // remove user from local storage
        localStorage.removeItem('user');

        // dispatch logout action
        dispatch(authActions.logout());

        // dispatch reset org
        dispatch(organizationActions.setOrg(null))
        dispatch(categoryActions.setCategory(null))
        dispatch(inventoryActions.setInventory(null))
        dispatch(ticketActions.setTickets(null))
        dispatch(ticketAdminActions.setTickets(null))
    }

    return {logout};
}