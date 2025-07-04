import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, TextField, Button, Grid, Typography, Box, 
  Checkbox, FormControlLabel, FormGroup, Paper, CircularProgress,
  Avatar, Card, CardContent, Divider, InputAdornment, IconButton
} from '@mui/material';
import { 
  Person, Email, Lock, School, Work, Flag, 
  AttachFile, Visibility, VisibilityOff 
} from '@mui/icons-material';

const Register = () => {
  // Form refs
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const institutionRef = useRef();
  const positionTitleRef = useRef();
  const countryRef = useRef();
  const cvRef = useRef();

  // State variables
  const [subjectAreas, setSubjectAreas] = useState([]);
  const [journalSections, setJournalSections] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fileName, setFileName] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch subject areas
    fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/journal/subject-areas/`)
      .then(response => response.json())
      .then(data => setSubjectAreas(data))
      .catch(error => console.error('Error fetching subject areas:', error));

    // Fetch journal sections
    fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/journal/journal-sections/`)
      .then(response => response.json())
      .then(data => setJournalSections(data))
      .catch(error => console.error('Error fetching journal sections:', error));
  }, []);

  const handleSubjectChange = (event) => {
    const value = event.target.value;
    if (event.target.checked) {
      setSelectedSubjects([...selectedSubjects, value]);
    } else {
      setSelectedSubjects(selectedSubjects.filter(id => id !== value));
    }
  };

  const handleSectionChange = (event) => {
    const value = event.target.value;
    if (event.target.checked) {
      setSelectedSections([...selectedSections, value]);
    } else {
      setSelectedSections(selectedSections.filter(id => id !== value));
    }
  };

  const validatePassword = () => {
    setPasswordMatch(passwordRef.current.value === confirmPasswordRef.current.value);
    return passwordRef.current.value === confirmPasswordRef.current.value;
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('first_name', firstNameRef.current.value);
    formData.append('last_name', lastNameRef.current.value);
    formData.append('email', emailRef.current.value);
    formData.append('password', passwordRef.current.value);
    formData.append('institution', institutionRef.current.value);
    formData.append('position_title', positionTitleRef.current.value);
    formData.append('country', countryRef.current.value);
    
    if (cvRef.current.files[0]) {
      formData.append('cv', cvRef.current.files[0]);
    }

    selectedSubjects.forEach(subject => {
      formData.append('subject_areas', subject);
    });

    selectedSections.forEach(section => {
      formData.append('journal_sections', section);
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/area-editor/register/`, {
        method: 'POST',
        body: formData,
      });

      const isJson = response.headers.get("content-type")?.includes("application/json");
      const responseData = isJson ? await response.json() : null;

      if (!response.ok) {
        console.error('Error response:', responseData);
        
        if (response.status === 400 && responseData) {
          const errorMessages = Object.entries(responseData)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('\n');
          alert(errorMessages || 'Validation error occurred.');
        } else {
          alert('An unexpected error occurred. Please try again.');
        }
        
        throw new Error(`Request failed with status ${response.status}`);
      }

      alert('Area Editor registration successful! Your application will be reviewed by the editorial team.');
      console.log('Success:', responseData);
      navigate('/login');
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mb: 2 }}>
              <Work fontSize="large" />
            </Avatar>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              Area Editor Registration
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              Join our editorial team and contribute to academic excellence
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1 }} /> Personal Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  inputRef={firstNameRef}
                  required
                  fullWidth
                  label="First Name"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  inputRef={lastNameRef}
                  required
                  fullWidth
                  label="Last Name"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  inputRef={emailRef}
                  required
                  fullWidth
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  inputRef={passwordRef}
                  required
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  onChange={validatePassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  inputRef={confirmPasswordRef}
                  required
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  variant="outlined"
                  onChange={validatePassword}
                  error={!passwordMatch}
                  helperText={!passwordMatch ? "Passwords don't match" : ""}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Professional Information */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                  <Work sx={{ mr: 1 }} /> Professional Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  inputRef={institutionRef}
                  required
                  fullWidth
                  label="Institution"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <School color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  inputRef={positionTitleRef}
                  required
                  fullWidth
                  label="Position Title"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Work color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  inputRef={countryRef}
                  required
                  fullWidth
                  label="Country"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Flag color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<AttachFile />}
                  sx={{ height: '56px', justifyContent: 'flex-start' }}
                >
                  {fileName || 'Upload CV'}
                  <input
                    type="file"
                    ref={cvRef}
                    hidden
                    accept=".pdf,.doc,.docx"
                    required
                    onChange={handleFileChange}
                  />
                </Button>
                <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                  PDF or Word document (required)
                </Typography>
              </Grid>

              {/* Expertise Selection */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                  Areas of Expertise
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Please select your areas of expertise (select at least one from each section)
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, maxHeight: 250, overflow: 'auto' }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Subject Areas
                  </Typography>
                  <FormGroup>
                    {subjectAreas.map((subject) => (
                      <FormControlLabel
                        key={subject.id}
                        control={
                          <Checkbox
                            value={subject.id}
                            onChange={handleSubjectChange}
                            color="primary"
                          />
                        }
                        label={subject.name}
                      />
                    ))}
                  </FormGroup>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, maxHeight: 250, overflow: 'auto' }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Journal Sections
                  </Typography>
                  <FormGroup>
                    {journalSections.map((section) => (
                      <FormControlLabel
                        key={section.id}
                        control={
                          <Checkbox
                            value={section.id}
                            onChange={handleSectionChange}
                            color="primary"
                          />
                        }
                        label={section.name}
                      />
                    ))}
                  </FormGroup>
                </Paper>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={isLoading || selectedSubjects.length === 0 || selectedSections.length === 0}
                  sx={{ py: 2, fontWeight: 'bold' }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Submit Application'
                  )}
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                  By submitting this form, you agree to our terms and conditions.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Register;