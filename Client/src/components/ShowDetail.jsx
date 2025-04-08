import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from "react-player";
import { apiConfig } from '../api/ApiConfig';
import { AuthContext } from '../contexts/AuthContext';
import noImage from '../img/download.jpeg';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Button,
    CircularProgress,
    Alert,
} from '@mui/material';

const ShowDetail = () => {
    const { id } = useParams(); // Extract show ID from URL
    const [show, setShow] = useState(null); // State for show details
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [isInWatchlist, setIsInWatchlist] = useState(false); // Watchlist toggle state
    const { auth } = useContext(AuthContext); // Get JWT token from AuthContext

    // Fetch show details and user's watchlist
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch show details
                const showResponse = await axios.get(`${apiConfig.baseUrl}shows/${id}`);
                console.log(showResponse);
                setShow(showResponse.data.show);

                if (auth.accessToken) {
                    // Fetch user's watchlist
                    const watchlistResponse = await axios.get(`${apiConfig.baseUrl}watchlist`, {
                        headers: {
                            Authorization: `Bearer ${auth.token}`,
                            User: `${auth.user.email}`
                        },
                    });

                    // Check if the current show is in the user's watchlist
                    const isInList = watchlistResponse.data?.watchlist?.some((item) => item._id === id);
                    setIsInWatchlist(isInList);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load show details');
                setLoading(false);
            }
        };

        fetchData();
    }, [id, auth.token]);

    // Add or Remove Show from Watchlist
    const handleWatchlistToggle = async () => {
        try {
            if (isInWatchlist) {
                // Remove from Watchlist                
                await axios.patch(`${apiConfig.baseUrl}watchlist`, { showId: id }, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                        User: `${auth.user.email}`
                    },
                });
                setIsInWatchlist(false);
            } else {
                // Add to Watchlist
                console.log('HERe 1');
                console.log(auth.token);
                await axios.post(`${apiConfig.baseUrl}watchlist`, { showId: id }, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                        User: `${auth.user.email}`
                    },
                });
                setIsInWatchlist(true);
            }
        } catch (err) {
            console.error('Failed to update watchlist:', err);
        }
    };

    if (loading) return <CircularProgress style={{ margin: '20px auto', display: 'block' }} />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{ padding: 3 }}>
            {show && (
                <Card sx={{ maxWidth: 800, margin: '0 auto' }}>
                    <CardMedia
                        component="img"
                        sx={{

                            height: 600,
                            width: '100%',
                            objectFit: 'contain',
                            bgcolor: 'white.100',
                        }}
                        image={show.thumbnail}
                        alt={show.title}
                        onError={(e) => {
                            e.target.src = noImage;
                        }}
                    />
                    <CardContent>
                        <Typography variant="h4" gutterBottom>
                            {show.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                            <strong>Genre:</strong> {show.genre}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                            <strong>Rating:</strong> {show.rating}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            {show.description}
                        </Typography>
                        <Box sx={{ marginTop: 2 }}>
                            <ReactPlayer
                                url={show.videoUrl}
                                width="100%"
                                height="300px"
                                controls={true}
                                fallback={<div>Your browser does not support this video.</div>}
                            />
                            {/* <video controls style={{ width: '100%' }}>
                                <source src={show.videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video> */}
                        </Box>
                        {auth.accessToken && (
                            <Button
                                variant={isInWatchlist ? 'outlined' : 'contained'}
                                color={isInWatchlist ? 'secondary' : 'primary'}
                                onClick={handleWatchlistToggle}
                                sx={{ marginTop: 2 }}
                            >
                                {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default ShowDetail;
