//Imports here
import watchlistRoutes from './watchlist.js';
import showsRoutes from './shows.js';
import authRoutes from './auth.js';

const constructorMethod = (app) => {
    app.use('/watchlist', watchlistRoutes);
    app.use('/shows', showsRoutes);
    app.use('/auth', authRoutes);


    app.use('{*splat}', (req, res) => {
        res.status(404).json({ error: 'Route Not found' });
    });
};

export default constructorMethod;
