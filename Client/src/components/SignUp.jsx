import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiConfig } from '../api/ApiConfig';
import { validateEmail, validatePass } from '../helper.js';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
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

            await axios.post(`${apiConfig.baseUrl}auth/signup`, { email: emailVal, pass: passVal });
            navigate('/');
        } catch (err) {
            console.error(err);
            setError(true);
            setErrorMsg(err.response?.data?.error || 'Signup failed');
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
                Signup
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
                        'Signup'
                    )}
                </Button>
            </form>
        </Box>
    );
};

export default Signup;
