const list = (knex) =>
    knex('theaters')
        .select();

const getMoviesByTheater = (knex, theaterId) =>
    knex('movies_theaters as mt')
        .join('theaters as t', 'mt.theater_id', 't.theater_id')
        .join('movies as m', 'mt.movie_id', 'm.movie_id')
        .select('m.*')
        .where({ 'mt.theater_id': theaterId });

module.exports = {
    list,
    getMoviesByTheater
};