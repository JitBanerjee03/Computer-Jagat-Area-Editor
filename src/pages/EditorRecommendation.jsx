import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  Card, 
  Badge, 
  Container, 
  Row, 
  Col, 
  Button,
  Alert,
  ProgressBar
} from "react-bootstrap";
import { 
  FaFilePdf, 
  FaDownload, 
  FaStar, 
  FaRegStar, 
  FaStarHalfAlt,
  FaArrowLeft
} from "react-icons/fa";
import { Link } from "react-router-dom";

const EditorRecommendation = () => {
  const { journalId } = useParams();
  const [editorFeedback, setEditorFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getEditorFeedback = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_DJANGO_URL}/associate-editor/recommendations/journal/${journalId}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch editor feedback");
        }

        const data = await response.json();
        setEditorFeedback(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getEditorFeedback();
  }, [journalId]);

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-warning" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-warning" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-secondary" />);
      }
    }

    return stars;
  };

  const getRecommendationBadge = (recommendation) => {
    switch (recommendation?.toLowerCase()) {
      case "accept":
        return <Badge bg="success">Accept</Badge>;
      case "minor_revision":
        return <Badge bg="primary">Minor Revision</Badge>;
      case "major_revision":
        return <Badge bg="warning" text="dark">Major Revision</Badge>;
      case "reject":
        return <Badge bg="danger">Reject</Badge>;
      default:
        return <Badge bg="secondary">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading editor recommendation...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          <Alert.Heading>Error loading recommendation</Alert.Heading>
          <p>{error}</p>
          <Link to={`/view-journal/${journalId}`} className="btn btn-primary">
            <FaArrowLeft /> Back to Journal
          </Link>
        </Alert>
      </Container>
    );
  }

  if (editorFeedback.length === 0) {
    return (
      <Container className="py-4">
        <Alert variant="info">
          <Alert.Heading>No Recommendation Available</Alert.Heading>
          <p>This journal doesn't have an editor recommendation yet.</p>
          <Link to={`/view-journal/${journalId}`} className="btn btn-primary">
            <FaArrowLeft /> Back to Journal
          </Link>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Editor Recommendation</h2>
        <Link to={`/view-journal/${journalId}`} className="btn btn-outline-primary">
          <FaArrowLeft /> Back to Journal
        </Link>
      </div>

      {editorFeedback.map((feedback) => (
        <Card key={feedback.id} className="mb-4 shadow-sm">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Associate Editor Recommendation</strong>
              <span className="ms-3">
                Submitted on: {new Date(feedback.submitted_at).toLocaleDateString()}
              </span>
            </div>
            <div>
              {getRecommendationBadge(feedback.recommendation)}
            </div>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={8}>
                <div className="mb-3">
                  <h5>Overall Rating</h5>
                  <div className="d-flex align-items-center">
                    {renderRatingStars(feedback.overall_rating)}
                    <span className="ms-2">{feedback.overall_rating}/5</span>
                  </div>
                </div>

                <div className="mb-3">
                  <h5>Summary</h5>
                  <div className="p-3 bg-light rounded">
                    {feedback.summary || "No summary provided"}
                  </div>
                </div>

                <div className="mb-3">
                  <h5>Justification</h5>
                  <div className="p-3 bg-light rounded">
                    {feedback.justification || "No justification provided"}
                  </div>
                </div>

                <div className="mb-3">
                  <h5>Public Comments to Author</h5>
                  <div className="p-3 bg-light rounded">
                    {feedback.public_comments_to_author || "No public comments provided"}
                  </div>
                </div>
              </Col>

              <Col md={4}>
                <div className="border-start ps-4">
                  <h5>Decision Metrics</h5>
                  <div className="mb-3">
                    <strong>Recommendation:</strong>
                    <div className="mt-1">
                      {getRecommendationBadge(feedback.recommendation)}
                    </div>
                  </div>
                  <div className="mb-3">
                    <strong>Overall Rating:</strong>
                    <div className="mt-1">
                      {feedback.overall_rating}/5
                    </div>
                    <div className="mt-1">
                      {renderRatingStars(feedback.overall_rating)}
                    </div>
                  </div>
                  <div className="mb-3">
                    <strong>Submission Date:</strong>
                    <div className="mt-1">
                      {new Date(feedback.submitted_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default EditorRecommendation;