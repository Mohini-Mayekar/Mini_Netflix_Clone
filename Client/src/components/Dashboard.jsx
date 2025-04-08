import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { apiConfig } from '../api/ApiConfig';
import { AuthContext } from '../contexts/AuthContext';
import noImage from '../img/download.jpeg';
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
    Pagination
} from '@mui/material';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [watchlistStatus, setWatchlistStatus] = useState({});
    const { auth } = useContext(AuthContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const showsResponse = await axios.get(`${apiConfig.baseUrl}shows/`, {
                    params: {
                        page: currentPage,
                        limit: itemsPerPage
                    }
                });

                if (!Array.isArray(showsResponse.data.shows)) {
                    throw new Error('Invalid data format');
                }
                //console.log(showsResponse);
                setShows(showsResponse.data.shows);
                setTotalPages(Math.ceil(showsResponse.data.totalCount / itemsPerPage));


                if (auth.accessToken) {
                    const watchlistResponse = await axios.get(`${apiConfig.baseUrl}watchlist`, {
                        headers: {
                            Authorization: `Bearer ${auth.accessToken}`,
                            User: `${auth.user.email}`
                        },
                    });

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
    }, [auth.accessToken, currentPage]);


    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

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
                    headers: {
                        Authorization: `Bearer ${auth.accessToken}`,
                        User: `${auth.user.email}`
                    },
                });
            } else {
                // Add to watchlist
                await axios.post(`${apiConfig.baseUrl}watchlist`, { showId }, {
                    headers: {
                        Authorization: `Bearer ${auth.accessToken}`,
                        User: `${auth.user.email}`
                    },
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
            <Grid container spacing={3}
                sx={{
                    flexGrow: 1,
                    flexDirection: 'row'
                }}>
                {shows.map((show) => (
                    <Grid show xs={12} sm={7} md={5} lg={4} xl={3} key={show._id}>
                        <Card variant='outlined'
                            sx={{
                                width: 250,
                                height: 400,
                                margin: '0 auto',
                                borderRadius: 2,
                                boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                position: 'relative',
                            }}
                        >

                            <CardMedia
                                component="img"
                                sx={{

                                    height: 200,
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

                            <CardContent
                                sx={{
                                    flexGrow: 1,
                                    overflow: 'hidden',
                                }}
                            >
                                <Typography variant="h6" component="div">
                                    <Link to={`/shows/${show._id}`}>
                                        {show.title}
                                    </Link>
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {show.description}
                                </Typography>

                                {auth.accessToken && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            p: 2,
                                            bgcolor: 'background.paper',
                                            borderColor: 'divider',
                                        }}
                                    >
                                        <Button
                                            variant={watchlistStatus[show._id] ? 'outlined' : 'contained'}
                                            color={watchlistStatus[show._id] ? 'secondary' : 'primary'}
                                            onClick={() => handleWatchlistToggle(show._id)}
                                            fullWidth
                                            size="small"
                                        >
                                            {watchlistStatus[show._id] ? 'Remove from Watchlist' : 'Add to Watchlist'}
                                        </Button>
                                    </Box>
                                )}

                            </CardContent>

                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                    sx={{
                        '& .MuiPaginationItem-root': {
                            color: 'text.primary',
                        },
                    }}
                />
            </Box>
        </Box>
    );
};

export default Dashboard;
