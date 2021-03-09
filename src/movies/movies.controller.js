const service = require('./movies.service');

async function checkMovieId(req, res, next) {
    const knex = req.app.get('db');
    const error = { status: 404, message: `Movie cannot be found.` };

    const { movieId } = req.params;
    if (!movieId) return next(error);

    let movie = await service.read(knex, movieId);

    if (!movie) return next(error);
    res.locals.movie = movie;
    next();
}

async function list(req, res, next) {
    const knex = req.app.get("db");
    const is_showing = req.query.is_showing;

    if (is_showing === 'true') {
        res.json({ data: await getShowing(knex) });
    } else {
        const movies = await service.list(knex);
        for (let movie of movies) {
            movie.reviews = await service.listReviewsById(knex, movie.movie_id);
        }
        res.json({ data: movies })
    }
}

async function getShowing(knex) {
    const movies = await service.listShowing(knex);
    for (let movie of movies) {
        movie.reviews = await service.listReviewsById(knex, movie.movie_id);
    }
    return movies;
}

async function read(req, res) {
    const { movie } = res.locals;
    res.json({ data: movie });
}

async function getTheaters(req, res) {
    const knex = req.app.get("db");
    const { movieId } = req.params;

    const theaters = await service.listTheatersById(knex, movieId)
    res.json({ data: theaters });
}

async function getReviews(req, res) {
    const knex = req.app.get("db");
    const { movieId } = req.params;
    const reviews = await service.listReviewsById(knex, movieId)

    for (let review of reviews) {
        review.critic = await service.getCriticById(knex, review.critic_id)
    }

    res.json({ data: reviews });
}

module.exports = {
    list,
    read: [checkMovieId, read],
    getReviews: [checkMovieId, getReviews],
    getTheaters: [checkMovieId, getTheaters]
};