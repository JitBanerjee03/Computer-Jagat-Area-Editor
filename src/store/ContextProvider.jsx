import { useEffect } from "react";
import { useReducer } from "react";
import { createContext, useState } from "react";

export const contextProviderDeclare=createContext({
    isloggedIn:Boolean,
    setLoggedIn:()=>{},
    areaEditor:{},
    setAreaEditor:()=>{},
    reviewers:[],
    fetchReviewers:()=>{},
    approvedReviewers:[],
    fetchApprovedReviewers:()=>{},
    journalAssign:[],
    setjournalAssign:()=>{},
    editors:[],
    setEditor:()=>{},
    approval:Boolean
});

const journalAssignReducer=(state,action)=>{
    return action.payload;   
}

const editorsReducer=(state,action)=>{
    return action.payload;  
}

export const ContextProvider=({children})=>{
    const [isloggedIn,setLoggedIn]=useState(false);
    const [areaEditor,setAreaEditor]=useState({});

    const [reviewers,setReviewers]=useState([]);
    const [approvedReviewers,setApprovedReviewers]=useState([]);
    const [approval,setApproval]=useState(false);

    const fetchReviewers=async()=>{
        const response=await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/reviewer/unapproved/`,{
            method:"GET",
            headers:{
                "content-type":"application/json"
            }
        })

        const data=await response.json();

        setReviewers(data);
    }
    
    const fetchApprovedReviewers=async()=>{
        const response=await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/reviewer/approved/`,{
            method:"GET",
            headers:{
                "content-type":"application/json"
            }
        })

        const data=await response.json();

        setApprovedReviewers(data);
    }
    
    const [journalAssign,dispatchAssign]=useReducer(journalAssignReducer,[]);

    const setjournalAssign= async(areaEditorId)=>{
        console.log(areaEditorId);
        const response=await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/area-editor/journal-assignments/${areaEditorId}/`,{
            method:"GET",
            headers:{
                "content-type":"application/json"
            }
        })

        const data=await response.json();

        const journalAssignAction={
            type:"SET_JOURNAL_ASSIGN",
            payload:data
        }

        dispatchAssign(journalAssignAction);
    }

    const [editors,dispatchEditors]=useReducer(editorsReducer,[]);

    const setEditors=async()=>{
        const response=await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/associate-editor/get-all/`,{
            method:"GET",
            headers:{
                "content-type":"application/json"
            }
        })

        const data=await response.json();
        console.log(data);
        const editorsAction={
            type:"SET_EDITOR",
            payload:data
        }

        dispatchEditors(editorsAction);
    }

    useEffect(()=>{

        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.get('logout') === 'true') {
            localStorage.removeItem('jwtToken');
            window.close(); // Close the tab after clearing token
            console.log('Hello from the Reviewer !');
            return;
        }

        const urlToken = urlParams.get('token');
        const localToken = localStorage.getItem('jwtToken');

        if (urlToken && !localToken) {
            localStorage.setItem('jwtToken', urlToken);
            console.log('Reviewer: Token stored from URL parameter');
        }

        const token = urlToken || localToken;

        if (!token) {
            window.location.href = 'https://computer-jagat.vercel.app/login';
            return;
        }

        const checkTokenValidation = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/sso-auth/validate-token/`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setAreaEditor(data);
                    setLoggedIn(true);
                    await setjournalAssign(data.area_editor_id);

                    const checkApproval=await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/area-editor/approval-status/${data.area_editor_id}/`,{
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    });

                    const responseData=await checkApproval.json();

                    setApproval(responseData.is_approved);
                } else {
                    localStorage.removeItem('jwtToken');
                    setLoggedIn(false);
                    window.location.href = 'https://computer-jagat.vercel.app/login';
                }
            } catch (error) {
                console.error("Token validation error:", error);
                localStorage.removeItem('jwtToken');
                setLoggedIn(false);
                window.location.href = 'https://computer-jagat.vercel.app/login';
            }
        };
        checkTokenValidation();
        fetchReviewers();
        fetchApprovedReviewers();
        setEditors();
    },[])

    return (
        <contextProviderDeclare.Provider value={{isloggedIn,
        setLoggedIn,
        areaEditor,
        setAreaEditor,
        reviewers,
        fetchReviewers,
        approvedReviewers,
        fetchApprovedReviewers,
        journalAssign,
        setjournalAssign,
        editors,
        setEditors,
        approval}}>
            {children}
        </contextProviderDeclare.Provider>
    )
}