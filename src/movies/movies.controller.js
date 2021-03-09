const service = require('./movies.service');
const Treeize = require("treeize");

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
    const tree = new Treeize();

    if (is_showing === 'true') {
        const movies = await service.listShowing(knex);
        tree.grow(movies)
        res.json({ data: tree.getData() });
    } else {
        const movies = await service.list(knex);
        tree.grow(movies)
        res.json({ data: tree.getData() });
    }
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

async function listReviews(req, res) {
    const knex = req.app.get("db");
    const { movieId } = req.params;
    const tree = new Treeize();

    const reviews = await service.listReviews(knex, movieId)
    tree.grow(reviews);

    res.json({ data: tree.getData() });
}

module.exports = {
    list,
    read: [checkMovieId, read],
    getReviews: [checkMovieId, listReviews],
    getTheaters: [checkMovieId, getTheaters]
};