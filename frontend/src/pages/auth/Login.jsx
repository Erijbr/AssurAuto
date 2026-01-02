import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/login', { email, password });
      login(res.data.token);
      toast.success('Connexion réussie !');
      
      // Redirection selon le rôle
      if (res.data.user.role === 'AGENT') {
        navigate('/agent');
      } else {
        navigate('/client');
      }
    } catch (error) {
      toast.error('Email ou mot de passe incorrect');
    }
  };

  return (
    <div style={styles.container}>
      <Toaster position="top-center" />
      <div style={styles.card}>
        <h2 style={styles.title}>Connexion Assur'Auto</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>Se connecter</button>
        </form>
        <p style={styles.text}>
          Pas encore de compte ? <Link to="/signup" style={styles.link}>S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}

// Styles simples (CSS-in-JS)
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' },
  card: { backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '350px' },
  title: { textAlign: 'center', color: '#1f2937', marginBottom: '1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { padding: '0.75rem', borderRadius: '4px', border: '1px solid #d1d5db' },
  button: { padding: '0.75rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  text: { textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' },
  link: { color: '#2563eb', textDecoration: 'none' }
};