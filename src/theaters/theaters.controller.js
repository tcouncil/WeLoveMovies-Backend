const service = require('./theaters.service');


async function list(req, res) {
    const knex = req.app.get("db");
    const theaters = await service.list(knex);
    for (let theater of theaters) {
       theater.movies = await service.getMoviesByTheater(knex, theater.theater_id);
    }
    res.json({ data: theaters })
}

module.exports = {
    list
};