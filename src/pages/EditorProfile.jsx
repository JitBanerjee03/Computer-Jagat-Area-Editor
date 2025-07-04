import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Badge, Button, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { 
  FaEnvelope, 
  FaPhone, 
  FaUniversity, 
  FaUserTie, 
  FaBook, 
  FaFilePdf,
  FaGlobe,
  FaGraduationCap,
  FaLanguage,
  FaOrcid,
  FaGoogle,
  FaLinkedin,
  FaEdit,
  FaCalendarAlt
} from "react-icons/fa";

const EditorProfile = () => {
    const { editorId } = useParams();
    const [editor, setEditor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEditorProfile = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/associate-editor/get-details/${editorId}/`);
                if (!response.ok) {
                    throw new Error('Failed to fetch editor profile');
                }
                const data = await response.json();
                setEditor(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEditorProfile();
    }, [editorId]);
    
    console.log(editor)

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    Error loading editor profile: {error}
                </Alert>
            </Container>
        );
    }

    if (!editor) {
        return (
            <Container className="mt-5">
                <Alert variant="warning">
                    Editor not found
                </Alert>
            </Container>
        );
    }

    // Parse language proficiency if it exists
    const parseLanguages = () => {
        if (!editor.language_proficiency) return [];
        return editor.language_proficiency.split('\n').map(lang => {
            const [language, proficiency] = lang.split('-');
            return { language, proficiency };
        });
    };

    const languages = parseLanguages();

    return (
        <Container className="py-4">
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="mb-3">
                        <Card.Body className="text-center">
                            {editor.profile_picture ? (
                                <img
                                    src={`http://localhost:8000${editor.profile_picture}`}
                                    alt={editor.user_full_name}
                                    className="rounded-circle mb-3"
                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                />
                            ) : (
                                <div className="rounded-circle bg-secondary mb-3 mx-auto d-flex align-items-center justify-content-center"
                                    style={{ width: '150px', height: '150px' }}>
                                    <span className="text-white display-4">
                                        {editor.user_full_name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <h3>{editor.user_full_name}</h3>
                            <p className="text-muted">{editor.position_title || 'Associate Editor'}</p>
                            
                            <div className="d-flex justify-content-center gap-2 mb-3">
                                {editor.cv && (
                                    <Button 
                                        variant="outline-primary" 
                                        href={`http://localhost:8000${editor.cv}`}
                                        target="_blank"
                                    >
                                        <FaFilePdf className="me-1" /> View CV
                                    </Button>
                                )}
                            </div>

                            <div className="text-start">
                                <div className="d-flex align-items-center mb-2">
                                    <FaCalendarAlt className="me-2 text-muted" />
                                    <small className="text-muted">
                                        Member since: {new Date(editor.date_joined).toLocaleDateString()}
                                    </small>
                                </div>
                                <Badge bg={editor.is_active ? "success" : "secondary"}>
                                    {editor.is_active ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Stats Card */}
                    <Card className="mb-3">
                        <Card.Body>
                            <h5 className="mb-3">Editorial Stats</h5>
                            <div className="d-flex justify-content-between">
                                <div className="text-center">
                                    <h6>Assignments</h6>
                                    <Badge bg="primary" className="fs-5">
                                        {editor.assignment_count || 0}
                                    </Badge>
                                </div>
                                <div className="text-center">
                                    <h6>Reviews</h6>
                                    <Badge bg="info" className="fs-5">
                                        {editor.review_count || 0}
                                    </Badge>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={8}>
                    <Card className="mb-3">
                        <Card.Body>
                            <h4 className="mb-4">Contact Information</h4>
                            
                            <Row>
                                <Col md={6} className="mb-3">
                                    <div className="d-flex align-items-center">
                                        <FaEnvelope className="me-2 text-primary" />
                                        <div>
                                            <strong>Email</strong>
                                            <div>
                                                <a href={`mailto:${editor.user_email}`}>{editor.user_email}</a>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                
                                <Col md={6} className="mb-3">
                                    <div className="d-flex align-items-center">
                                        <FaPhone className="me-2 text-success" />
                                        <div>
                                            <strong>Phone</strong>
                                            <div>{editor.phone_number || 'Not provided'}</div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            
                            <Row>
                                <Col md={6} className="mb-3">
                                    <div className="d-flex align-items-center">
                                        <FaUniversity className="me-2 text-info" />
                                        <div>
                                            <strong>Institution</strong>
                                            <div>
                                                {editor.institution || 'Not provided'}
                                                {editor.department && (
                                                    <div className="text-muted">{editor.department}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                
                                <Col md={6} className="mb-3">
                                    <div className="d-flex align-items-center">
                                        <FaUserTie className="me-2 text-warning" />
                                        <div>
                                            <strong>Position</strong>
                                            <div>{editor.position_title || 'Not provided'}</div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6} className="mb-3">
                                    <div className="d-flex align-items-center">
                                        <FaGlobe className="me-2 text-primary" />
                                        <div>
                                            <strong>Country</strong>
                                            <div>{editor.country || 'Not provided'}</div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    
                    <Card className="mb-3">
                        <Card.Body>
                            <h4 className="mb-4">Expertise</h4>
                            
                            <div className="mb-4">
                                <h5>Subject Areas</h5>
                                <div className="d-flex flex-wrap gap-1">
                                    {editor.subject_areas.map((area) => (
                                        <Badge key={area.id} bg="primary" className="text-wrap">
                                            <FaBook className="me-1" />
                                            {area.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <h5>Journal Sections</h5>
                                <div className="d-flex flex-wrap gap-1">
                                    {editor.journal_sections.map((section) => (
                                        <Badge key={section.id} bg="info" className="text-wrap">
                                            <FaBook className="me-1" />
                                            {section.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {editor.research_interests && (
                                <div className="mb-3">
                                    <h5>Research Interests</h5>
                                    <p>{editor.research_interests}</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                    
                    <Card className="mb-3">
                        <Card.Body>
                            <h4 className="mb-4">Biography</h4>
                            <p>{editor.editor_bio || 'No biography provided'}</p>
                        </Card.Body>
                    </Card>
                    
                    <Card className="mb-3">
                        <Card.Body>
                            <h4 className="mb-4">Professional Information</h4>
                            
                            <Row>
                                {languages.length > 0 && (
                                    <Col md={6} className="mb-3">
                                        <div className="d-flex align-items-start">
                                            <FaLanguage className="me-2 text-info mt-1" />
                                            <div>
                                                <strong>Language Proficiency</strong>
                                                <ul className="mb-0">
                                                    {languages.map((lang, index) => (
                                                        <li key={index}>
                                                            {lang.language}: <span className="text-capitalize">{lang.proficiency.toLowerCase()}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </Col>
                                )}
                                
                                {editor.orcid_id && (
                                    <Col md={6} className="mb-3">
                                        <div className="d-flex align-items-center">
                                            <FaOrcid className="me-2 text-success" />
                                            <div>
                                                <strong>ORCID</strong>
                                                <div>
                                                    <a 
                                                        href={`https://orcid.org/${editor.orcid_id}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                    >
                                                        {editor.orcid_id}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                )}
                                
                                {editor.google_scholar_profile && (
                                    <Col md={6} className="mb-3">
                                        <div className="d-flex align-items-center">
                                            <FaGoogle className="me-2 text-danger" />
                                            <div>
                                                <strong>Google Scholar</strong>
                                                <div>
                                                    <a 
                                                        href={editor.google_scholar_profile} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                    >
                                                        View Profile
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                )}
                                
                                {editor.linkedin_profile && (
                                    <Col md={6} className="mb-3">
                                        <div className="d-flex align-items-center">
                                            <FaLinkedin className="me-2 text-primary" />
                                            <div>
                                                <strong>LinkedIn</strong>
                                                <div>
                                                    <a 
                                                        href={editor.linkedin_profile} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                    >
                                                        View Profile
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                )}

                                {editor.scopus_id && (
                                    <Col md={6} className="mb-3">
                                        <div className="d-flex align-items-center">
                                            <FaGlobe className="me-2 text-info" />
                                            <div>
                                                <strong>Scopus ID</strong>
                                                <div>{editor.scopus_id}</div>
                                            </div>
                                        </div>
                                    </Col>
                                )}

                                {editor.web_of_science_id && (
                                    <Col md={6} className="mb-3">
                                        <div className="d-flex align-items-center">
                                            <FaGlobe className="me-2 text-info" />
                                            <div>
                                                <strong>Web of Science ID</strong>
                                                <div>{editor.web_of_science_id}</div>
                                            </div>
                                        </div>
                                    </Col>
                                )}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default EditorProfile;