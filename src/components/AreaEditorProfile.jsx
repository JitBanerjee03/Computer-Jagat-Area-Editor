import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const AreaEditorProfile = ({ areaEditor }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [subjectAreas, setSubjectAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serverErrors, setServerErrors] = useState(null);
  
  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue,
    formState: { errors } 
  } = useForm();

  useEffect(() => {
    if (areaEditor) {
      const fetchData = async () => {
        try {
          const subjectsRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_DJANGO_URL}/journal/subject-areas/`
          );
          setSubjectAreas(subjectsRes.data);
          
          const formValues = {
            phone_number: areaEditor.phone_number || '',
            institution: areaEditor.institution || '',
            department: areaEditor.department || '',
            position_title: areaEditor.position_title || '',
            orcid_id: areaEditor.orcid_id || '',
            research_interests: areaEditor.research_interests || '',
            google_scholar_profile: areaEditor.google_scholar_profile || '',
            scopus_id: areaEditor.scopus_id || '',
            web_of_science_id: areaEditor.web_of_science_id || '',
            linkedin_profile: areaEditor.linkedin_profile || '',
            editor_bio: areaEditor.editor_bio || '',
            country: areaEditor.country || '',
            language_proficiency: areaEditor.language_proficiency || '',
            subject_areas: areaEditor.subject_areas?.map(sa => sa.id.toString()) || []
          };
          
          reset(formValues);
          
          if(areaEditor.profile_picture) {
            setPreviewImage(areaEditor.profile_picture);
          } else {
            setPreviewImage('/default-profile.png');
          }

          setIsLoading(false);
        } catch (error) {
          console.error('Error initializing form:', error);
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [areaEditor, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCvChange = (e) => {
    setCvFile(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    setServerErrors(null);
    try {
      const formData = new FormData();
      
      if (data.subject_areas) {
        data.subject_areas.forEach(item => {
          formData.append('subject_areas', parseInt(item));
        });
      }
      
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'subject_areas' && value !== null && value !== undefined && value !== '') {
          formData.append(key, value);
        }
      });
      
      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }
      if (cvFile) {
        formData.append('cv', cvFile);
      }
      
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_DJANGO_URL}/area-editor/update/${areaEditor.id}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${'token'}`
          },
        }
      );
      
      alert('Profile updated successfully!');
      setIsEditing(false);
      
      if (profilePicture && response.data.profile_picture) {
        setPreviewImage(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/${response.data.profile_picture}`);
        setProfilePicture(null);
      }
      
      if (cvFile && response.data.cv) {
        setCvFile(null);
      }
      
    } catch (error) {
      console.error('Error updating profile:', error);
      
      if (error.response) {
        if (error.response.status === 400) {
          setServerErrors(error.response.data);
        } else {
          alert(`Error: ${error.response.status} - ${error.response.statusText}`);
        }
      } else {
        alert('Network error. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'N/A';
    }
  };

  if (isLoading) {
    return <div className="text-center mt-5">Loading profile...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">Area Editor Profile</h3>
            <button 
              className={`btn ${isEditing ? 'btn-light' : 'btn-outline-light'}`}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card-body">
              {serverErrors && (
                <div className="alert alert-danger">
                  <h5>Please fix the following errors:</h5>
                  <ul className="mb-0">
                    {Object.entries(serverErrors).map(([field, errors]) => (
                      <li key={field}>
                        <strong>{field}:</strong> {Array.isArray(errors) ? errors.join(' ') : errors}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="row">
                <div className="col-md-3 text-center mb-4">
                  <div className="position-relative">
                    <img 
                      src={previewImage} 
                      alt="Profile" 
                      className="img-thumbnail mb-2" 
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                    <input
                      type="file"
                      id="profilePicture"
                      className="d-none"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <label 
                      htmlFor="profilePicture" 
                      className="btn btn-sm btn-outline-primary position-absolute bottom-0 start-50 translate-middle-x"
                    >
                      Change
                    </label>
                  </div>

                  <div className="mt-3">
                    <label className="form-label">CV (PDF/DOC)</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCvChange}
                    />
                    {areaEditor.cv && !cvFile && (
                      <small className="text-muted">Current: {areaEditor.cv.split('/').pop()}</small>
                    )}
                  </div>
                </div>

                <div className="col-md-9">
                  <div className="mb-3">
                    <h4>{areaEditor.full_name}</h4>
                    <p className="text-muted">
                      <i className="bi bi-envelope me-2"></i>
                      {areaEditor.email}
                    </p>
                  </div>
                  
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        {...register('phone_number')}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">ORCID ID</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register('orcid_id')}
                        placeholder="0000-0000-0000-0000"
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">Institution</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register('institution')}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">Department</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register('department')}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">Position Title</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register('position_title')}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">Country</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register('country')}
                      />
                    </div>
                    
                    <div className="col-12">
                      <label className="form-label">Research Interests</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        {...register('research_interests')}
                      />
                    </div>
                    
                    <div className="col-12">
                      <label className="form-label">Editor Bio</label>
                      <textarea
                        className="form-control"
                        rows="5"
                        {...register('editor_bio')}
                        placeholder="Brief biography that will be displayed on the journal website"
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">Google Scholar Profile</label>
                      <input
                        type="url"
                        className="form-control"
                        {...register('google_scholar_profile')}
                        placeholder="https://scholar.google.com/..."
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">Scopus ID</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register('scopus_id')}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">Web of Science ID</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register('web_of_science_id')}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">LinkedIn Profile</label>
                      <input
                        type="url"
                        className="form-control"
                        {...register('linkedin_profile')}
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                    
                    <div className="col-12">
                      <label className="form-label">Language Proficiency</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        {...register('language_proficiency')}
                        placeholder="List languages you're proficient in (e.g., English - fluent, Spanish - intermediate)"
                      />
                    </div>
                    
                    <div className="col-md-12">
                      <label className="form-label">Subject Areas</label>
                      <select
                        multiple
                        className="form-select"
                        {...register('subject_areas')}
                        onChange={(e) => {
                          const options = e.target.options;
                          const selectedValues = [];
                          for (let i = 0; i < options.length; i++) {
                            if (options[i].selected) {
                              selectedValues.push(options[i].value);
                            }
                          }
                          setValue('subject_areas', selectedValues);
                        }}
                      >
                        {subjectAreas.map(area => (
                          <option 
                            key={area.id} 
                            value={area.id.toString()}
                            selected={areaEditor.subject_areas?.some(sa => sa.id === area.id)}
                          >
                            {area.name}
                          </option>
                        ))}
                      </select>
                      <small className="text-muted">Hold Ctrl/Cmd to select multiple</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-footer bg-light">
              <div className="d-flex justify-content-end gap-2">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary px-4">
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="card-body">
            <div className="row">
              <div className="col-md-3 text-center mb-4">
                <img 
                  src={`${import.meta.env.VITE_BACKEND_DJANGO_URL}/${areaEditor.profile_picture}/`} 
                  alt="Profile" 
                  className="img-thumbnail" 
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
                {areaEditor.cv && (
                  <div className="mt-3">
                    <a 
                      href={`${import.meta.env.VITE_BACKEND_DJANGO_URL}/${areaEditor.cv}/`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      View CV
                    </a>
                  </div>
                )}
              </div>

              <div className="col-md-9">
                <h4>{areaEditor.full_name}</h4>
                {areaEditor.position_title && <p className="text-muted mb-1">{areaEditor.position_title}</p>}
                {areaEditor.institution && <p className="text-muted mb-1">{areaEditor.institution}</p>}
                {areaEditor.department && <p className="text-muted mb-1">{areaEditor.department}</p>}
                {areaEditor.country && <p className="text-muted mb-1">{areaEditor.country}</p>}

                <ul className="list-unstyled mt-3">
                  {areaEditor.phone_number && (
                    <li className="mb-1">
                      <i className="bi bi-telephone me-2"></i>
                      {areaEditor.phone_number}
                    </li>
                  )}
                  <li className="mb-1">
                    <i className="bi bi-envelope me-2"></i>
                    {areaEditor.email}
                  </li>
                  {areaEditor.orcid_id && (
                    <li className="mb-1">
                      <i className="bi bi-person-badge me-2"></i>
                      ORCID: {areaEditor.orcid_id}
                    </li>
                  )}
                </ul>

                {areaEditor.research_interests && (
                  <div className="mt-4">
                    <h5>Research Interests</h5>
                    <p>{areaEditor.research_interests}</p>
                  </div>
                )}

                {areaEditor.editor_bio && (
                  <div className="mt-4">
                    <h5>Bio</h5>
                    <p style={{ whiteSpace: 'pre-line' }}>{areaEditor.editor_bio}</p>
                  </div>
                )}

                {(areaEditor.google_scholar_profile || areaEditor.scopus_id || areaEditor.web_of_science_id || areaEditor.linkedin_profile) && (
                  <div className="mt-4">
                    <h5>Profiles</h5>
                    <ul className="list-unstyled">
                      {areaEditor.google_scholar_profile && (
                        <li className="mb-1">
                          <i className="bi bi-google me-2"></i>
                          <a href={areaEditor.google_scholar_profile} target="_blank" rel="noopener noreferrer">
                            Google Scholar
                          </a>
                        </li>
                      )}
                      {areaEditor.scopus_id && (
                        <li className="mb-1">
                          <i className="bi bi-journal me-2"></i>
                          Scopus ID: {areaEditor.scopus_id}
                        </li>
                      )}
                      {areaEditor.web_of_science_id && (
                        <li className="mb-1">
                          <i className="bi bi-journal me-2"></i>
                          Web of Science ID: {areaEditor.web_of_science_id}
                        </li>
                      )}
                      {areaEditor.linkedin_profile && (
                        <li className="mb-1">
                          <i className="bi bi-linkedin me-2"></i>
                          <a href={areaEditor.linkedin_profile} target="_blank" rel="noopener noreferrer">
                            LinkedIn Profile
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {areaEditor.language_proficiency && (
                  <div className="mt-4">
                    <h5>Language Proficiency</h5>
                    <p>{areaEditor.language_proficiency}</p>
                  </div>
                )}

                {(areaEditor.subject_areas?.length > 0 || areaEditor.subject_area_names?.length > 0) && (
                  <div className="mt-4">
                    <h5>Subject Areas</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {/* Display subject_area_names if available */}
                      {areaEditor.subject_area_names?.map((name, index) => (
                        <span key={`name-${index}`} className="badge bg-primary">
                          {name}
                        </span>
                      ))}
                      {/* Fallback to subject_areas if names not available */}
                      {(!areaEditor.subject_area_names || areaEditor.subject_area_names.length === 0) &&
                        subjectAreas
                          .filter(area => areaEditor.subject_areas.some(sa => sa.id === area.id))
                          .map(area => (
                            <span key={area.id} className="badge bg-primary">
                              {area.name}
                            </span>
                          ))}
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <h5>Statistics</h5>
                  <p>Assignments Handled: {areaEditor.number_of_assignments_handled}</p>
                  <p>Member Since: {formatDate(areaEditor.date_joined)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AreaEditorProfile;
