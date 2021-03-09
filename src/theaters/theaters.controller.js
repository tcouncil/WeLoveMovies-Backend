const service = require('./theaters.service');
const Treeize = require("treeize");

async function list(req, res) {
    const knex = req.app.get("db");
    const theaters = await service.list(knex);
    const tree = new Treeize();
    tree.grow(theaters);
    res.json({ data: tree.getData() });
}

module.exports = {
    list
};