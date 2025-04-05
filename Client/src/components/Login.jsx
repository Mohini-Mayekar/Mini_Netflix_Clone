import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { apiConfig } from '../api/ApiConfig';
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';

const Login = () => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);  // Add loading state
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);  // Set loading to true when submitting
        setError('');      // Clear any previous errors

        try {
            const response = await axios.post(`${apiConfig.baseUrl}auth/login`, { email, pass });

            // Save tokens in localStorage and context
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);

            setAuth({
                accessToken: response.data.token.accessToken,
                refreshToken: response.data.token.refreshToken,
                user: response.data.token.user,
            });

            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);  // Set loading to false when done
        }
    };

    return (
        <Box sx={{ maxWidth: 400, margin: '50px auto', padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}  // Disable field when loading
                />
                <TextField
                    fullWidth
                    type="password"
                    label="Password"
                    margin="normal"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    disabled={loading}  // Disable field when loading
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2 }}
                    disabled={loading}  // Disable button when loading
                >
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />  // Show spinner when loading
                    ) : (
                        'Login'
                    )}
                </Button>
            </form>
        </Box>
    );
};

export default Login;
