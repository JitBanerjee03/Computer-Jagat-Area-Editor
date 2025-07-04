import React, { useState } from 'react';
import { Table, Alert, Badge, Form, Row, Col, Button, Card } from 'react-bootstrap';
import { FaInfoCircle, FaEye, FaCheckCircle, FaArchive, FaSearch, FaFilter, FaUserPlus, FaComments } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AssignedJournals = ({ assignments }) => {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Format date to MM-DD format
  const formatDate = (dateString) => {
    if (!dateString) return '~';
    const date = new Date(dateString);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  // Status options for filter
  const statusOptions = ['all', 'assigned', 'reviewing', 'completed'];

  // Filter assignments based on search and filters
  const filteredAssignments = assignments?.filter(assignment => {
    const matchesSearch = 
      assignment.journal_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.journal?.toString().includes(searchTerm);
    
    const matchesStatus = 
      statusFilter === 'all' || assignment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  // Count assignments by status for summary cards
  const statusCounts = assignments?.reduce((acc, assignment) => {
    acc[assignment.status] = (acc[assignment.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col-md-12">
          <Alert variant="info">
            <FaInfoCircle /> Has a recently submitted manuscript disappeared from this list? 
            Check the <a href="#archive" className="alert-link">ARCHIVE tab</a> above! 
            Rejected/published manuscripts are moved to the ARCHIVE tab.
          </Alert>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-3">
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Total Assignments</Card.Title>
              <Card.Text className="display-6">
                {assignments?.length || 0}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Assigned</Card.Title>
              <Card.Text className="display-6">
                {statusCounts?.assigned || 0}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Completed</Card.Title>
              <Card.Text className="display-6">
                {statusCounts?.completed || 0}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </div>

      {/* Search and Filter Controls */}
      <div className="row mb-3">
        <div className="col-md-12">
          <Form>
            <Row className="align-items-end">
              <Col md={6}>
                <Form.Group controlId="searchTerm">
                  <Form.Label>Search</Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type="text"
                      placeholder="Search by journal ID or title..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="outline-secondary">
                      <FaSearch />
                    </Button>
                  </div>
                </Form.Group>
              </Col>
              <Col md={6} className="text-end">
                <Button 
                  variant="outline-primary"
                  onClick={() => setShowFilters(!showFilters)}
                  className="me-2"
                >
                  <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
                <Button 
                  variant="outline-secondary"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </Col>
            </Row>

            {showFilters && (
              <Row className="mt-3">
                <Col md={4}>
                  <Form.Group controlId="statusFilter">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      {statusOptions.map(option => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                          {statusCounts && option !== 'all' ? ` (${statusCounts[option] || 0})` : ''}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            )}
          </Form>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="row">
        <div className="col-md-12">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Journal ID</th>
                <th>Assigned Date</th>
                <th>Title</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments && filteredAssignments.length > 0 ? (
                filteredAssignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td>{assignment.id}</td>
                    <td>{assignment.journal}</td>
                    <td>{formatDate(assignment.assigned_date)}</td>
                    <td>{assignment.journal_title || 'Untitled'}</td>
                    <td>
                      <Badge 
                        bg={
                          assignment.status === 'assigned' ? 'info' :
                          assignment.status === 'reviewing' ? 'warning' :
                          assignment.status === 'completed' ? 'success' : 'secondary'
                        }
                        className="text-capitalize"
                      >
                        {assignment.status}
                      </Badge>
                    </td>
                    <td>
                      <Link 
                        to={`/view-journal/${assignment.journal}`} 
                        className="btn btn-sm btn-primary me-1"
                        title="View Details"
                      >
                        <FaEye />
                      </Link>
                      {assignment.status !== 'completed' && (
                        <>
                          <Link
                            to={`/journal/${assignment.journal}/recommendation`}
                            className="btn btn-sm btn-success me-1"
                            title="Submit Recommendation"
                          >
                            <FaCheckCircle />
                          </Link>

                          <Link
                            to={`/assign-editor/${assignment.journal}`}
                            className="btn btn-sm btn-info me-1"
                            title="Assign Editor"
                          >
                            <FaUserPlus />
                          </Link>
                        </>
                      )}
                      <Link
                        to={`/editors-feedback/${assignment.journal}/`}
                        className="btn btn-sm btn-warning me-1"
                        title="Editors Feedback"
                      >
                        <FaComments />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    {assignments?.length === 0 
                      ? 'You don\'t have any journal assignments yet.' 
                      : 'No assignments match your search criteria.'}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AssignedJournals;