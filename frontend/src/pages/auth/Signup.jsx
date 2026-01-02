import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import toast, { Toaster } from 'react-hot-toast';

export default function Signup() {
  const [formData, setFormData] = useState({
    full_name: '', email: '', password: '', role: 'CLIENT'
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/signup', formData);
      toast.success('Compte créé ! Connectez-vous.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      toast.error("Erreur lors de l'inscription");
    }
  };

  return (
    <div style={styles.container}>
      <Toaster position="top-center" />
      <div style={styles.card}>
        <h2 style={styles.title}>Créer un compte</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text" placeholder="Nom complet"
            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            style={styles.input} required
          />
          <input
            type="email" placeholder="Email"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={styles.input} required
          />
          <input
            type="password" placeholder="Mot de passe"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={styles.input} required
          />
          <select 
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            style={styles.input}
          >
            <option value="CLIENT">Client</option>
            <option value="AGENT">Agent d'Assurance</option>
          </select>
          <button type="submit" style={styles.button}>S'inscrire</button>
        </form>
        <p style={styles.text}>
          Déjà un compte ? <Link to="/login" style={styles.link}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' },
  card: { backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '350px' },
  title: { textAlign: 'center', color: '#1f2937', marginBottom: '1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { padding: '0.75rem', borderRadius: '4px', border: '1px solid #d1d5db' },
  button: { padding: '0.75rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  text: { textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' },
  link: { color: '#10b981', textDecoration: 'none' }
};