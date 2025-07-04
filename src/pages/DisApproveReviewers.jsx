import React, { useContext, useState } from 'react';
import { Table, Badge, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import { 
  FaEnvelope, 
  FaPhone, 
  FaUniversity, 
  FaUserTie, 
  FaBook, 
  FaSearch, 
  FaEye,
  FaCheck, 
  FaTimes,
  FaExclamationTriangle
} from 'react-icons/fa';
import { contextProviderDeclare } from '../store/ContextProvider';
import { Link } from 'react-router-dom';
import NotApprovedEmptyMessage from '../components/NotApprovedEmptyMessage';

const DisApproveReviewers = () => {
    const { approvedReviewers, fetchApprovedReviewers, areaEditor, fetchReviewers, approval } = useContext(contextProviderDeclare);
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectAreaFilter, setSubjectAreaFilter] = useState('');
    const [loading, setLoading] = useState({});
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Get approved reviewers
    const getApprovedReviewers = approvedReviewers?.filter(reviewer => reviewer.is_approved) || [];

    // Get unique subject areas for filter dropdown
    const subjectAreas = [...new Set(
        getApprovedReviewers?.flatMap(reviewer => 
            reviewer.subject_areas.map(area => area.name)
        ) || []
    )];

    // Check if area editor has matching subject area with reviewer
    const hasMatchingSubjectArea = (reviewer) => {
        if (!areaEditor || !areaEditor.subject_areas) return false;
        
        const editorAreaIds = areaEditor.subject_areas.map(area => area.id);
        return reviewer.subject_areas.some(area => 
            editorAreaIds.includes(area.id)
        );
    };

    // Check if the reviewer is the same as the area editor
    const isSelfReviewer = (reviewer) => {
        return areaEditor && reviewer.user_id === areaEditor.user_id;
    };

    // Filter reviewers based on search term and subject area
    const filteredReviewers = getApprovedReviewers?.filter(reviewer => {
        const matchesSearch = 
            reviewer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reviewer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reviewer.institution.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesSubjectArea = 
            !subjectAreaFilter || 
            reviewer.subject_areas.some(area => 
                area.name.toLowerCase().includes(subjectAreaFilter.toLowerCase())
            );
        
        return matchesSearch && matchesSubjectArea;
    });

    const handleDisapprove = async (reviewerId) => {
        setLoading(prev => ({ ...prev, [reviewerId]: true }));
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/reviewer/disapprove/${reviewerId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization header if needed
                    // 'Authorization': `Bearer ${yourToken}`,
                },
                body: JSON.stringify({
                    is_approved: false // Setting to false for disapproval
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.detail || data.message || 'Failed to update reviewer status');
            }

            // Refresh the reviewers list
            await fetchReviewers();
            await fetchApprovedReviewers();
            setSuccess('Reviewer disapproved successfully');
        } catch (err) {
            setError(err.message || 'An error occurred while updating reviewer status');
        } finally {
            setLoading(prev => ({ ...prev, [reviewerId]: false }));
        }
    };

    return (
        <>  
            { approval === false ? <NotApprovedEmptyMessage/> :
                <div className="container-fluid p-3">
                    <h4 className="mb-4">Reviewer Disapproval Queue</h4>
                    
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
                                        <FaBook />
                                    </InputGroup.Text>
                                    <Form.Select
                                        value={subjectAreaFilter}
                                        onChange={(e) => setSubjectAreaFilter(e.target.value)}
                                    >
                                        <option value="">All Subject Areas</option>
                                        {subjectAreas.map(area => (
                                            <option key={area} value={area}>{area}</option>
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
                                <th>Subject Areas</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReviewers && filteredReviewers.length > 0 ? (
                                filteredReviewers.map((reviewer) => (
                                    <tr key={reviewer.id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                {reviewer.profile_picture ? (
                                                    <img 
                                                        src={reviewer.profile_picture} 
                                                        alt={reviewer.full_name}
                                                        className="rounded-circle me-2"
                                                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <div className="rounded-circle bg-secondary me-2 d-flex align-items-center justify-content-center"
                                                        style={{ width: '40px', height: '40px' }}>
                                                        <span className="text-white">
                                                            {reviewer.full_name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                                <div>
                                                    <strong>{reviewer.full_name}</strong>
                                                    {isSelfReviewer(reviewer) && (
                                                        <div className="text-danger small mt-1">
                                                            <FaExclamationTriangle className="me-1" />
                                                            This is your reviewer profile
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column">
                                                <div className="mb-1">
                                                    <FaEnvelope className="me-2 text-primary" />
                                                    <a href={`mailto:${reviewer.email}`}>{reviewer.email}</a>
                                                </div>
                                                {reviewer.phone_number && (
                                                    <div>
                                                        <FaPhone className="me-2 text-success" />
                                                        {reviewer.phone_number}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <FaUniversity className="me-2 text-info" />
                                                <div>
                                                    <div>{reviewer.institution}</div>
                                                    {reviewer.department && (
                                                        <small className="text-muted">{reviewer.department}</small>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <FaUserTie className="me-2 text-warning" />
                                                <div>
                                                    {reviewer.position_title || 'Not specified'}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-wrap gap-1">
                                                {reviewer.subject_areas.map((area) => (
                                                    <Badge key={area.id} bg="primary" className="text-wrap">
                                                        <FaBook className="me-1" />
                                                        {area.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            <Badge bg="success">
                                                Approved
                                            </Badge>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <Link 
                                                    to={`/reviewer/${reviewer.id}`}
                                                    className="btn btn-sm btn-info"
                                                    title="View Full Profile"
                                                >
                                                    <FaEye className="me-1" />
                                                    View
                                                </Link>
                                                {hasMatchingSubjectArea(reviewer) && (
                                                    isSelfReviewer(reviewer) ? (
                                                        <Button 
                                                            variant="secondary" 
                                                            size="sm"
                                                            disabled
                                                            title="Cannot disapprove your own reviewer profile"
                                                        >
                                                            <FaTimes className="me-1" />
                                                            Self Disapproval
                                                        </Button>
                                                    ) : (
                                                        <Button 
                                                            variant="danger" 
                                                            size="sm"
                                                            onClick={() => handleDisapprove(reviewer.id)}
                                                            title="Disapprove Reviewer"
                                                            disabled={loading[reviewer.id]}
                                                        >
                                                            {loading[reviewer.id] ? (
                                                                <span>
                                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                    Processing...
                                                                </span>
                                                            ) : (
                                                                <span>
                                                                    <FaTimes className="me-1" />
                                                                    Disapprove
                                                                </span>
                                                            )}
                                                        </Button>
                                                    )
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        {getApprovedReviewers.length === 0 
                                            ? "No approved reviewers found" 
                                            : "No reviewers found matching your criteria"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            }
        </>
    );
};

export default DisApproveReviewers;