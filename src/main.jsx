import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'; //Import Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import About from './pages/About.jsx';
import Account from './pages/Account.jsx';
import ApproveReviewers from './pages/ApproveReviewer.jsx';
import ReviewerProfile from './pages/ReviewerProfile.jsx';
import DisApproveReviewers from './pages/DisApproveReviewers.jsx';
import ReviewerFeedBack from './pages/ReviewerFeedBack.jsx';
import AreaEditorAssignment from './pages/AreaEditorAssignment.jsx';
import JournalView from './pages/JournalView.jsx';
import AssignEditor from './pages/AssignEditor.jsx';
import EditorProfile from './pages/EditorProfile.jsx';
import EditorAssignmentHistory from './pages/EditorAssignmentHistory.jsx';
import EditorRecommendation from './pages/EditorRecommendation.jsx';
import AreaEditorFeedback from './pages/AreaEditorFeedback.jsx';

const router=createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    children:[
      {path:'/',element:<About/>},
      {path:'/sign-up',element:<Register/>},
      {path:'/login',element:<Login/>},
      {path:'/account',element:<Account/>},
      {path:'/approve-reviewers',element:<ApproveReviewers/>},
      {path:'/reviewer/:reviewerId',element:<ReviewerProfile/>},
      {path:'/disapprove-reviewers',element:<DisApproveReviewers/>},
      {path:'/reviewer-assignment',element:<ReviewerFeedBack/>},
      {path:'/assigned-journals',element:<AreaEditorAssignment/>}, 
      {path:'/view-journal/:journalId',element:<JournalView/>}, 
      {path:'/assign-editor/:journalId',element:<AssignEditor/>}, 
      {path:'/editor-profile/:editorId',element:<EditorProfile/>},
      {path:'/editor-assignment',element:<EditorAssignmentHistory/>},  
      {path:'/editors-feedback/:journalId',element:<EditorRecommendation/>},
      {path:'/journal/:journalID/recommendation',element:<AreaEditorFeedback/>},
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
