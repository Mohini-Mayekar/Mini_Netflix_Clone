import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';

const Navigation = () => {
    const { auth, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <AppBar position="relative"
            sx={{
                width: 'auto',
                alignContent: 'center',
                alignItems: 'center'
            }}
        >
            <Toolbar>
                {/* <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Mini Netflix Clone
                </Typography> */}

                {/* Show dashboard link only when logged in */}

                <Button className='link' color="inherit" component={Link} to="/dashboard">
                    Dashboard
                </Button>


                {/* Show watchlist link only when logged in */}
                {auth.accessToken && (
                    <Button className='link' color="inherit" component={Link} to="/watchlist">
                        Watchlist
                    </Button>
                )}

                {/* Conditional login/logout button */}
                {auth.accessToken ? (
                    <Button className='link' color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                ) : (
                    <Button className='link' color="inherit" component={Link} to="/">
                        Login
                    </Button>
                )}
            </Toolbar>
        </AppBar>

    );
};

export default Navigation;
