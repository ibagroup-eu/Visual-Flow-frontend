// eslint-disable-next-line no-unused-vars
module.exports = (error, req, res, _) =>
    res.status(500).json({ error: error?.message });
