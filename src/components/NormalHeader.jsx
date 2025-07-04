import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';

const NormalHeader = () => {
  const [activeButton, setActiveButton] = useState('');
  const navigate=useNavigate();

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    navigate(`${buttonName}`);
  };

  return (
    <>
      <div style={{ marginLeft: '8%', marginRight: '8%' }}>
        <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
          <Link
            to="/"
            className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
          >
            <img src="/logo.png" alt="Logo" width="40" height="40" className="me-2" />
            <span className="fs-4">Journal Management System</span>
          </Link>

          <div className="col-md-3 text-end">
            <button
              type="button"
              onClick={() => handleButtonClick('login')}
              className={`btn me-2 ${activeButton === 'login' ? 'btn-primary' : 'btn-outline-primary'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => handleButtonClick('sign-up')}
              className={`btn ${activeButton === 'signup' ? 'btn-primary' : 'btn-outline-primary'}`}
            >
              Sign-up
            </button>
          </div>
        </header>
      </div>
    </>
  );
};

export default NormalHeader;
