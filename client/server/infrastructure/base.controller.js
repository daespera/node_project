module.exports = (repo) => {
    var module = {};

    module.insert = async (req, res) => {
        try {
            const model = await repo.create(req.body);
            if (model != undefined) {
                return res.status(201).send({
                    message: (model ? model.id+" saved" : "data not saved"),
                    data: model
                });
            }
            return res.status(400).send({
                message: "Error creating."
            });
        } catch(err) {
            return res.status(400).send({
                message: "something went wrong."
            });
        }
    };

    module.list = async (req, res) => {
        try {
            const model = await repo.retrieve(req.params._id,req.query);
            if (model != undefined) {
                return res.status(200).send({
                    message: (model.length != 0 ? "data retrieved" : "no data"),
                    data: model
                });
            }
            return res.status(400).send({
                message: "Error retrieving."
            });
        } catch(err) {
            return res.status(400).send({
                message: "something went wrong."
            });
        }
    };

    module.edit = async (req, res) => {
        try {
            const model = await repo.update(req.params._id,req.body);
            if (model != undefined) {
                return res.status(200).send({
                    message: (model ? req.params._id+" updated" : req.params._id+" not updated"),
                    data: model
                });
            }
            return res.status(400).send({
                message: "Error updating."
            });
        } catch(err) {
            return res.status(400).send({
                message: "something went wrong."
            });
        }
    };

    module.delete = async (req, res) => {
        try {
            const model = await repo.delete(req.params._id);
            if (model != undefined) {
                return res.status(200).send({
                    message: (model[0] ? req.params._id+" deleted" : req.params._id+" deleted"),
                    data: model[0]
                });
            }
            return res.status(400).send({
                message: "Error deleting."
            });
        } catch(err) {
            return res.status(400).send({
                message: "Error deleting."
            });
        }
    };
    return module;
};