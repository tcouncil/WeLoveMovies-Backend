const list = (knex) =>
    knex('movies')
        .select();

const listShowing = (knex) =>
    knex('movies as m')
        .distinct('m.*')
        .join('movies_theaters as mt', 'm.movie_id', 'mt.movie_id')
        .where({ 'mt.is_showing': true });

const listTheatersById = (knex, movieId) =>
    knex('theaters as t')
        .select()
        .join('movies_theaters as mt', 't.theater_id', 'mt.theater_id')
        .where({ 'mt.is_showing': true })
        .andWhere({ 'mt.movie_id': movieId })

const listReviewsById = (knex, movieId) =>
    knex('reviews')
        .select()
        .where({ 'movie_id': movieId });

const read = (knex, movieId) =>
    knex('movies')
        .select()
        .where({ 'movie_id': movieId })
        .first();

const getCriticById = (knex, criticId) =>
    knex('critics')
        .select()
        .where({ 'critic_id': criticId })
        .first();

module.exports = {
    list,
    read,
    listShowing,
    listTheatersById,
    listReviewsById,
    getCriticById
}