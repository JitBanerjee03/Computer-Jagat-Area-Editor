import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./styles/Header.css";
import { contextProviderDeclare } from "../store/ContextProvider";

const LoggedHeader = () => {
  const [activeLink, setActiveLink] = useState('About');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const getContextProvider = useContext(contextProviderDeclare);
  const { setLoggedIn, isloggedIn, user } = getContextProvider;

  const handleLogOut = () => {
    localStorage.removeItem('jwtToken'); // Clear current domain token (5178)

    const portals = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5177'
    ];

    // Inject hidden iframes to trigger logout on each portal
    portals.forEach((portal) => {
      const iframe = document.createElement('iframe');
      iframe.src = `${portal}?logout=true&timestamp=${Date.now()}`; // Add timestamp to avoid caching
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    });

    // Allow iframes to execute logout code, then redirect
    setTimeout(() => {
      window.location.href = 'http://localhost:5178/login';
    }, 1500);
  }

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveLink('About');
    else if (path === '/account') setActiveLink('Account');
    else if (path === '/assigned-journals') setActiveLink('Assigned Journals');
    else if (path === '/approve-reviewers') setActiveLink('Approve Reviewers');
    else if (path === '/disapprove-reviewers') setActiveLink('Disapprove Reviewers');
    else if (path === '/reviewer-assignment') setActiveLink('Reviewer Assignment');
    else if (path === '/editor-assignment') setActiveLink('Editor Assignment');
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', path: '/', icon: '🏠' },
    { label: 'Account', path: '/account', icon: '👤' },
    { label: 'Journals', path: '/assigned-journals', icon: '📚' },
    { label: 'Approve Reviewers', path: '/approve-reviewers', icon: '✅' },
    { label: 'Disapprove Reviewers', path: '/disapprove-reviewers', icon: '❌' },
    { label: 'Reviewer Assignment', path: '/reviewer-assignment', icon: '📋' },
    { label: 'Editor Assignment', path: '/editor-assignment', icon: '✏️' }
  ];

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <img 
              src="/logo.png"
              alt="Journal Management System Logo" 
              className="logo-image"
              width="40"
              height="40"
            />
            <span className="logo-text">Journal Management System</span>
          </Link>
        </div>

        <nav className="main-nav">
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.label} className="nav-item">
                <Link 
                  to={link.path}
                  className={`nav-link ${activeLink === link.label ? 'active' : ''}`}
                >
                  <span className="nav-icon">{link.icon}</span>
                  <span className="nav-label">{link.label}</span>
                  <span className="active-indicator"></span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="user-controls">
          {/*user?.profile_picture ? (
            <img 
              src={`http://localhost:8000${user.profile_picture}`}
              alt={user.user_full_name}
              className="user-avatar"
            />
          ) : (
            <div className="user-avatar-fallback">
              {user?.user_full_name?.charAt(0)?.toUpperCase()}
            </div>
          )*/}
          <button 
            className="logout-button"
            onClick={handleLogOut}
          >
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default LoggedHeader;