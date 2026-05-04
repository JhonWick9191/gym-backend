import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateUser from './pages/CreateUser';
import ExpiredUsers from './pages/ExpiredUsers';
import ExpiringSoon from './pages/ExpiringSoon';
import AllStudents from './pages/AllStudents';
import TestEmail from './pages/TestEmail';
import Loading from './components/Loading';
import './styles.css';
import { useLocation } from 'react-router-dom';

const PageWrapper = ({ children }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1 second delay as requested

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (isLoading) return <Loading />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        
        {/* Protected Management Routes */}
        <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/create-user" element={<PageWrapper><CreateUser /></PageWrapper>} />
        <Route path="/expired" element={<PageWrapper><ExpiredUsers /></PageWrapper>} />
        <Route path="/expiring-this-month" element={<PageWrapper><ExpiringSoon /></PageWrapper>} />
        <Route path="/all-students" element={<PageWrapper><AllStudents /></PageWrapper>} />
        <Route path="/test-email" element={<PageWrapper><TestEmail /></PageWrapper>} />
        
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
