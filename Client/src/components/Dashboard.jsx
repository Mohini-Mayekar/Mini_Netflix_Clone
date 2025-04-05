import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { apiConfig } from '../api/ApiConfig';
import { AuthContext } from '../contexts/AuthContext';
import {
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    CircularProgress,
    Alert,
    Button,
    Box,
    Tooltip,
    IconButton
} from '@mui/material';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';

import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [watchlistStatus, setWatchlistStatus] = useState({}); // Track watchlist status per show
    const { auth } = useContext(AuthContext);

    // Fetch shows and watchlist status
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch shows
                const showsResponse = await axios.get(`${apiConfig.baseUrl}shows/`);
                if (!Array.isArray(showsResponse.data.shows)) {
                    throw new Error('Invalid data format');
                }
                setShows(showsResponse.data.shows);

                // Fetch watchlist if user is authenticated
                if (auth.accessToken) {
                    const watchlistResponse = await axios.get(`${apiConfig.baseUrl}watchlist`, {
                        headers: { Authorization: `Bearer ${auth.accessToken}` },
                    });

                    // Create a map of watchlist status
                    const statusMap = {};
                    showsResponse.data.shows.forEach(show => {
                        statusMap[show._id] = watchlistResponse.data?.watchlist?.some(
                            item => item._id.toString() === show._id.toString()
                        ) || false;
                    });
                    setWatchlistStatus(statusMap);
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load shows');
                setLoading(false);
            }
        };

        fetchData();
    }, [auth.accessToken]);

    // Toggle watchlist status
    const handleWatchlistToggle = async (showId) => {
        if (!auth.accessToken) {
            alert('Please login to manage your watchlist');
            return;
        }

        try {
            const isCurrentlyInWatchlist = watchlistStatus[showId];

            if (isCurrentlyInWatchlist) {
                // Remove from watchlist
                await axios.patch(`${apiConfig.baseUrl}watchlist`, { showId }, {
                    headers: { Authorization: `Bearer ${auth.accessToken}` },
                });
            } else {
                // Add to watchlist
                await axios.post(`${apiConfig.baseUrl}watchlist`, { showId }, {
                    headers: { Authorization: `Bearer ${auth.accessToken}` },
                });
            }

            // Update local state
            setWatchlistStatus(prev => ({
                ...prev,
                [showId]: !isCurrentlyInWatchlist
            }));
        } catch (err) {
            console.error('Failed to update watchlist:', err);
        }
    };

    if (loading) return <CircularProgress style={{ margin: '20px auto', display: 'block' }} />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Shows
            </Typography>
            <Grid container spacing={3}>
                {shows.map((show) => (
                    <Grid item xs={12} sm={6} md={4} key={show._id}>
                        <Card sx={{
                            width: 300,  // Fixed width (px)
                            height: 400, // Fixed height (px)
                            display: 'flex',
                            flexDirection: 'column'
                        }}>

                            <CardMedia
                                component="img"
                                height="200"
                                image={show.thumbnail}
                                alt={show.title}
                            />

                            <CardContent>
                                <Typography variant="h6" component="div">
                                    <Link to={`/shows/${show._id}`}>
                                        {show.title}
                                    </Link>
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {show.description}
                                </Typography>
                                {auth.accessToken && (
                                    <Button
                                        variant={watchlistStatus[show._id] ? 'outlined' : 'contained'}
                                        color={watchlistStatus[show._id] ? 'secondary' : 'primary'}
                                        onClick={() => handleWatchlistToggle(show._id)}
                                        fullWidth
                                        size="small"
                                    >
                                        {watchlistStatus[show._id] ? 'Remove from Watchlist' : 'Add to Watchlist'}
                                    </Button>
                                    // <Tooltip
                                    //     title={watchlistStatus[show._id] ? "Remove from watchlist" : "Add to watchlist"}
                                    //     arrow
                                    //     placement="top"
                                    // >
                                    //     <IconButton
                                    //         onClick={(e) => {
                                    //             e.stopPropagation(); // Prevent card click if needed
                                    //             handleWatchlistToggle(show._id);
                                    //         }}
                                    //         color={watchlistStatus[show._id] ? "primary" : "default"}
                                    //         sx={{
                                    //             '&:hover': {
                                    //                 backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                    //             }
                                    //         }}
                                    //     >
                                    //         {watchlistStatus[show._id] ? (
                                    //             <Bookmark color="primary" />
                                    //         ) : (
                                    //             <BookmarkBorder />
                                    //         )}
                                    //     </IconButton>
                                    // </Tooltip>

                                )}
                            </CardContent>

                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box >
    );
};

export default Dashboard;
