import { useContext, useEffect, useState } from "react";
import { contextProviderDeclare } from "../store/ContextProvider";
import AreaEditorProfile from "../components/AreaEditorProfile";

const Account=()=>{
    const getContextObject=useContext(contextProviderDeclare);
    const {areaEditor}=getContextObject;
    const [areaEditorDetails,setAreaEditorDetails]=useState({});
    console.log(areaEditor);
    useEffect(()=>{
        if (!areaEditor?.area_editor_id) return; //check if author is available before making the API call
        const getUserProfileDetails=async()=>{
            const areaEditorResponse=await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/area-editor/get-details/${areaEditor.area_editor_id}/`,{
                method:"GET",
                headers:{
                    "content-type":"application/json"
                }
            })

            const areaEditorData=await areaEditorResponse.json();
            console.log(areaEditorData);
            setAreaEditorDetails(areaEditorData);
        }

        getUserProfileDetails();
    },[]);
    
    return (
        <AreaEditorProfile areaEditor={areaEditorDetails}/>
    )
}

export default Account;