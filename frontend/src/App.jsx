import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';

// Pages (On les créera juste après)
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ClientDashboard from './pages/client/ClientDashboard';
import NewClaim from './pages/client/NewClaim';
import AgentDashboard from './pages/agent/AgentDashboard';
import Navbar from './components/navbar';
// Composant de Protection
const PrivateRoute = ({ children, roleRequired }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;
  if (roleRequired && user.role !== roleRequired) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Navbar />
        <Routes>
          {/* Routes Publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Espace CLIENT */}
          <Route path="/client" element={
            <PrivateRoute roleRequired="CLIENT">
              <ClientDashboard />
            </PrivateRoute>
          } />
          <Route path="/client/new" element={
            <PrivateRoute roleRequired="CLIENT">
              <NewClaim />
            </PrivateRoute>
          } />

          {/* Espace AGENT */}
          <Route path="/agent" element={
            <PrivateRoute roleRequired="AGENT">
              <AgentDashboard />
            </PrivateRoute>
          } />

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;