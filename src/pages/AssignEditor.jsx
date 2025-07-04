import React, { useContext, useEffect, useState } from 'react';
import { Table, Badge, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import { 
  FaEnvelope, 
  FaPhone, 
  FaUniversity, 
  FaUserTie, 
  FaBook, 
  FaSearch, 
  FaUser, 
  FaUserPlus,
  FaExclamationTriangle
} from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { contextProviderDeclare } from '../store/ContextProvider';

const AssignEditor = () => {
    const { editors, setEditors, areaEditor, setjournalAssign } = useContext(contextProviderDeclare);
    const { journalId } = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [loading, setLoading] = useState({});
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [articleDetails, setArticleDetails] = useState({});

    useEffect(() => {   
        const fetchArticleDetails = async () => {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/journal/detail/${journalId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization header if needed
                    // 'Authorization': `Bearer ${yourToken}`,
                },
            });

            const data = await response.json();
            setArticleDetails(data);
        };

        fetchArticleDetails();
    }, [journalId]);

    // Check if the editor is the same as the article author
    const isArticleAuthor = (editor) => {
        return articleDetails.user_id && editor.user_id === articleDetails.user_id;
    };

    // Get unique departments for filter dropdown
    const departments = [...new Set(
        editors?.map(editor => editor.department).filter(Boolean) || []
    )];

    // Filter editors based on search term and department
    const filteredEditors = editors?.filter(editor => {
        const matchesSearch = 
            editor.user_full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            editor.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            editor.institution.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesDepartment = 
            !departmentFilter || 
            (editor.department && editor.department.toLowerCase().includes(departmentFilter.toLowerCase()));
        
        return matchesSearch && matchesDepartment;
    });

    const handleAssign = async (editorId) => {
        if (!journalId) {
            setError("No journal ID found in URL params");
            return;
        }

        setLoading(prev => ({ ...prev, [editorId]: true }));
        setError(null);
        setSuccess(null);

        try {
            // Replace with your actual API endpoint
            const response = await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/associate-editor/assign-journal/${journalId}/${editorId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization header if needed
                    // 'Authorization': `Bearer ${yourToken}`,
                },
            });

            const data = await response.json();
            
            if (!response.ok) {
                // Handle specific error messages from the backend
                if (data.detail) {
                    throw new Error(data.detail);
                } else if (data.message) {
                    throw new Error(data.message);
                } else if (response.status === 400) {
                    throw new Error('This editor is already assigned to this journal');
                } else {
                    throw new Error('Failed to assign editor');
                }
            }
            
            const changeStatusInProgress = await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/area-editor/assignments/${journalId}/${areaEditor.area_editor_id}/set-in-progress/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization header if needed
                    // 'Authorization': `Bearer ${yourToken}`,
                },
            });
            
            await setjournalAssign(areaEditor.area_editor_id);
            await setEditors(); // Update context if needed
            setSuccess(data.message || 'Editor assigned to journal successfully');

            const changeJournalStatus = await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/journal/mark-assigned-to-associate-editor/${journalId}/`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
        } catch (err) {
            setError(err.message || 'An error occurred while assigning the editor');
        } finally {
            setLoading(prev => ({ ...prev, [editorId]: false }));
        }
    };

    return (
        <div className="container-fluid p-3">
            <h4 className="mb-4">Assign Editors to Journal #{journalId}</h4>
            
            {/* Display success/error messages */}
            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
                    {success}
                </Alert>
            )}
            
            {/* Search and Filter Controls */}
            <div className="row mb-3">
                <div className="col-md-6">
                    <Form.Group>
                        <InputGroup>
                            <InputGroup.Text>
                                <FaSearch />
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Search by name, email or institution..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                    </Form.Group>
                </div>
                <div className="col-md-6">
                    <Form.Group>
                        <InputGroup>
                            <InputGroup.Text>
                                <FaUniversity />
                            </InputGroup.Text>
                            <Form.Select
                                value={departmentFilter}
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                            >
                                <option value="">All Departments</option>
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </Form.Select>
                        </InputGroup>
                    </Form.Group>
                </div>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Institution</th>
                        <th>Position</th>
                        <th>Department</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEditors && filteredEditors.length > 0 ? (
                        filteredEditors.map((editor) => (
                            <tr key={editor.id}>
                                <td>
                                    <div className="d-flex align-items-center">
                                        {editor.profile_picture ? (
                                            <img 
                                                src={editor.profile_picture} 
                                                alt={editor.user_full_name}
                                                className="rounded-circle me-2"
                                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div className="rounded-circle bg-secondary me-2 d-flex align-items-center justify-content-center"
                                                style={{ width: '40px', height: '40px' }}>
                                                <span className="text-white">
                                                    {editor.user_full_name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <strong>{editor.user_full_name}</strong>
                                            {isArticleAuthor(editor) && (
                                                <div className="text-danger small mt-1">
                                                    <FaExclamationTriangle className="me-1" />
                                                    Warning: Cannot assign author as editor due to conflict of interest.
                                                </div>
                                            )}
                                            <div className="text-muted small">
                                                {editor.country}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex flex-column">
                                        <div className="mb-1">
                                            <FaEnvelope className="me-2 text-primary" />
                                            <a href={`mailto:${editor.user_email}`}>{editor.user_email}</a>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <FaUniversity className="me-2 text-info" />
                                        <div>
                                            <div>{editor.institution}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <FaUserTie className="me-2 text-warning" />
                                        <div>
                                            {editor.position_title || 'Not specified'}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    {editor.department ? (
                                        <Badge bg="primary" className="text-wrap">
                                            <FaUniversity className="me-1" />
                                            {editor.department}
                                        </Badge>
                                    ) : (
                                        <span className="text-muted">Not specified</span>
                                    )}
                                </td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <Link 
                                            to={`/editor-profile/${editor.id}`} 
                                            className="btn btn-sm btn-info"
                                            title="View Profile"
                                        >
                                            <FaUser className="me-1" />
                                            View
                                        </Link>
                                        {isArticleAuthor(editor) ? (
                                            <Button 
                                                variant="secondary" 
                                                size="sm"
                                                disabled
                                                title="Cannot assign article author as editor"
                                            >
                                                <FaUserPlus className="me-1" />
                                                Author
                                            </Button>
                                        ) : (
                                            <Button 
                                                variant="success" 
                                                size="sm"
                                                onClick={() => handleAssign(editor.id)}
                                                title="Assign Editor"
                                                disabled={loading[editor.id]}
                                            >
                                                {loading[editor.id] ? (
                                                    <span>
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        Assigning...
                                                    </span>
                                                ) : (
                                                    <span>
                                                        <FaUserPlus className="me-1" />
                                                        Assign
                                                    </span>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">
                                No editors found matching your criteria
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default AssignEditor;