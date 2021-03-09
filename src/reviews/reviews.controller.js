const service = require('./reviews.service');

async function checkId(req, res, next) {
    const knex = req.app.get("db");
    const error = { status: 404, message: `Review cannot be found.` };

    const { reviewId } = req.params;
    if (!reviewId) return next(error);

    const review = await service.read(knex, reviewId);

    if (!review) return next(error);
    res.locals.review = review;
    next();
}

async function update(req, res) {
    const knex = req.app.get("db");
    const { reviewId } = req.params;
    const { review } = res.locals;
    const updatedReview = { ...review };

    if (req.body.data.content)
        updatedReview.content = req.body.data.content;

    if (req.body.data.score)
        updatedReview.score = req.body.data.score;

    const data = await service.updateReviewById(knex, reviewId, updatedReview);
    updatedReview.critic = await service.getCriticById(knex, updatedReview.critic_id);

    res.json({ data: updatedReview })
}

async function destroy(req, res) {
    const knex = req.app.get("db");
    const { reviewId } = req.params;
    await service.deleteReviewById(knex, reviewId);
    res.sendStatus(204);
}

module.exports = {
    update: [checkId, update],
    delete: [checkId, destroy]
};