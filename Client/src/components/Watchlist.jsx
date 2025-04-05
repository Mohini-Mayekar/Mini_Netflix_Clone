import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { apiConfig } from '../api/ApiConfig';
import {
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    CircularProgress,
    Alert,
    Box,
    Button,
} from '@mui/material';
import { Link } from 'react-router-dom';

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { auth } = useContext(AuthContext);

    // Fetch user's watchlist
    const fetchWatchlist = async () => {
        try {
            const response = await axios.get(`${apiConfig.baseUrl}watchlist`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setWatchlist(response.data.watchlist);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching watchlist:', err);
            setError('Failed to load watchlist');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWatchlist();
    }, [auth.token]);

    // Remove show from watchlist
    const handleRemoveFromWatchlist = async (showId) => {
        try {
            await axios.patch(`${apiConfig.baseUrl}watchlist`, { showId }, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });

            // Optimistically update UI
            setWatchlist(prev => prev.filter(show => show._id !== showId));
        } catch (err) {
            console.error('Failed to remove from watchlist:', err);
            // Re-fetch to ensure sync with server
            fetchWatchlist();
        }
    };

    if (loading) return <CircularProgress style={{ margin: '20px auto', display: 'block' }} />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                My Watchlist
            </Typography>
            {watchlist && watchlist.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                    Your watchlist is empty.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {watchlist.map((show) => (
                        <Grid item xs={12} sm={6} md={4} key={show._id}>
                            <Card>
                                <Link to={`/shows/${show._id}`} style={{ textDecoration: 'none' }}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={show.thumbnail}
                                        alt={show.title}
                                    />
                                </Link>
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        <Link to={`/shows/${show._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            {show.title}
                                        </Link>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {show.description}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleRemoveFromWatchlist(show._id)}
                                        fullWidth
                                        size="small"
                                    >
                                        Remove from Watchlist
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default Watchlist;
