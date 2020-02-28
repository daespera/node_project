module.exports = (repo, db) => {
    var module = {};

    module.insert = async (req, res) => {
        try {
            const model = await repo.create(req.body);
            if (model != undefined) {
                res.status(201);
                return res.send(model);
            }
            res.status(400);
            return res.send({
                message: "Error creating."
            });
        } catch(err) {
            res.status(400);
            return res.send({
                message: "something went wrong."
            });
        }
    };

    module.list = async (req, res) => {
        try {
            const model = await repo.retrieve(req.params._id,req.query);
            if (model != undefined) {
                res.status(200);
                return res.send(model);
            }
            res.status(400);
            return res.send({
                message: "Error retrieving."
            });
        } catch(err) {
            res.status(400);
            return res.send({
                message: "something went wrong."
            });
        }
    };

    module.edit = async (req, res) => {
        try {
            const model = await repo.update(req.params._id,req.body);
            if (model != undefined) {
                res.status(200);
                return res.send({
                    message: (model[0] ? req.params._id+" updated" : req.params._id+" not updated"),
                    updated: model[0]
                });
            }
            res.status(400);
            return res.send({
                message: "Error updating."
            });
        } catch(err) {
            res.status(400);
            return res.send({
                message: "something went wrong."
            });
        }
    };

    module.delete = async (req, res) => {
        try {
            const model = await repo.delete(req.params._id);
            if (model != undefined) {
                res.status(200);
                return res.send({
                    message: (model[0] ? req.params._id+" deleted" : req.params._id+" deleted"),
                    deleted: model[0]
                });
            }
            res.status(400);
            return res.send({
                message: "Error deleting."
            });
        } catch(err) {
            res.status(400);
            return res.send({
                message: "Error deleting."
            });
        }
    };
    return module;
};