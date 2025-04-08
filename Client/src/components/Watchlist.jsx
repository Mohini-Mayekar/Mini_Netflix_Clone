import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { apiConfig } from '../api/ApiConfig';
import noImage from '../img/download.jpeg';
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
    Pagination,
} from '@mui/material';
import { Link } from 'react-router-dom';

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { auth } = useContext(AuthContext);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8;

    // Fetch user's watchlist
    const fetchWatchlist = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiConfig.baseUrl}watchlist`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                    User: `${auth.user.email}`
                },
                params: {
                    page: currentPage,
                    limit: itemsPerPage
                }
            });
            setWatchlist(response.data.watchlist);
            setTotalPages(Math.ceil(response.data.totalCount / itemsPerPage));
            setLoading(false);
        } catch (err) {
            console.error('Error fetching watchlist:', err);
            setError('Failed to load watchlist');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWatchlist();
    }, [auth.token, currentPage]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Remove show from watchlist
    const handleRemoveFromWatchlist = async (showId) => {
        try {
            await axios.patch(`${apiConfig.baseUrl}watchlist`, { showId }, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                    User: `${auth.user.email}`
                },
            });

            fetchWatchlist();
        } catch (err) {
            console.error('Failed to remove from watchlist:', err);
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
                <div>
                    <Grid container spacing={3}
                        sx={{
                            flexGrow: 1,
                            flexDirection: 'row'
                        }}
                    >
                        {watchlist.map((show) => (
                            <Grid show xs={12} sm={7} md={5} lg={4} xl={3} key={show._id}>
                                <Card variant='outlined'
                                    sx={{
                                        top: 10,
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
                                    <Link to={`/shows/${show._id}`} style={{ textDecoration: 'none' }}>
                                        <CardMedia
                                            component="img"
                                            display='auto'
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
                                    </Link>
                                    <CardContent
                                        sx={{
                                            flexGrow: 1,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <Typography variant="h6" component="div">
                                            <Link to={`/shows/${show._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {show.title}
                                            </Link>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            {show.description}
                                        </Typography>
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
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleRemoveFromWatchlist(show._id)}
                                                fullWidth
                                                size="small"
                                            >
                                                Remove from Watchlist
                                            </Button>
                                        </Box>
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
                </div>
            )}
        </Box>
    );
};

export default Watchlist;
