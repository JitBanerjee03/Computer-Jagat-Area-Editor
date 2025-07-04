import { useContext } from "react";
import { contextProviderDeclare } from "../store/ContextProvider";
import LoggedHeader from "./LoggedHeader";
import NormalHeader from "./NormalHeader";
const Header=()=>{
    const getContextProviderDetails=useContext(contextProviderDeclare);
    const {isloggedIn}=getContextProviderDetails;

    return (
        <>
            {isloggedIn ? <LoggedHeader/> : <NormalHeader/>}
        </>
    )
}

export default Header;