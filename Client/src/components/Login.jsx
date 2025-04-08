import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { apiConfig } from '../api/ApiConfig';
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { validateEmail, validatePass } from '../helper.js';

const Login = () => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePassChange = (event) => {
        setPass(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(false);
        setErrorMsg('');

        try {
            let emailData = document.getElementById('email');
            let passData = document.getElementById('pass');
            let emailVal;
            let passVal;
            let errors = [];
            if (emailData) {
                try {
                    emailVal = validateEmail(emailData.value, 'Email');
                } catch (err) {
                    errors.push(err);
                }
            }
            if (passData) {
                try {
                    passVal = validatePass(passData.value, 'Password');
                } catch (err) {
                    errors.push(err);
                }
            }
            if (errors.length > 0) {
                setError(true);
                setErrorMsg(errors.join('\n'));
                return;
            }
            const response = await axios.post(`${apiConfig.baseUrl}auth/login`, { email: emailVal, pass: passVal });

            // Saving tokens in localStorage and context
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
            setError(true);
            setErrorMsg(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 400,
                margin: '50px auto',
                padding: 3,
                boxShadow: 3,
                borderRadius: 2,
                textAlign: 'center',
            }}
        >
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>


            {error && errorMsg.split('\n').map((msg, index) => (
                <Alert key={index} severity="error" sx={{ marginBottom: 1 }}>
                    {msg}
                </Alert>
            ))}
            <form onSubmit={handleSubmit}>
                <TextField
                    id="email"
                    fullWidth
                    label="Email"
                    margin="normal"
                    value={email}
                    onChange={(e) => handleEmailChange(e)}
                    disabled={loading}
                />
                <TextField
                    id="pass"
                    fullWidth
                    type="password"
                    label="Password"
                    margin="normal"
                    value={pass}
                    onChange={(e) => handlePassChange(e)}
                    disabled={loading}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2 }}
                    disabled={loading}
                >
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        'Login'
                    )}
                </Button>
            </form>

            <Box sx={{ textAlign: 'center', marginTop: 2 }}>
                <Typography variant="body2">
                    Don't have an account?{' '}
                    {loading ? (
                        <span style={{ color: 'text.disabled' }}>
                            Sign up here!
                        </span>
                    ) : (
                        <Link
                            to="/signup"
                            style={{
                                textDecoration: 'none',
                                color: '#1976d2',
                                pointerEvents: loading ? 'none' : 'auto'
                            }}
                        >
                            Sign up here!
                        </Link>
                    )}
                </Typography>
            </Box>
        </Box>
    );
};

export default Login;
