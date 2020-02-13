module.exports = (repo, db) => {
    var module = {};

    module.insert = (req, res) => {
        return repo.create(req.body).then((model) => {
            if (model != undefined) {
                res.status(201);
                return res.send(model);
            }
            res.status(400);
            return res.send({
                message: "Error creating."
            });
        })
        .catch(function(error) {
            res.status(400);
            return res.send({
                message: "Error creating."
            });
        });
    };

    module.list = (req, res) => {
        return repo.retrieve(req.params._id,req.query).then((model) => {
            if (model != undefined) {
                res.status(201);
                return res.send(model);
            }
            res.status(400);
            return res.send({
                message: "Error creating."
            });
        })
        .catch(function(error) {
            res.status(400);
            return res.send({
                message: "Error creating."
            });
        });
    };

    module.update = (req, res) => {
        return repo.create(req.body).then((model) => {
            if (model != undefined) {
                res.status(201);
                return res.send(model);
            }
            res.status(400);
            return res.send({
                message: "Error creating."
            });
        })
        .catch(function(error) {
            res.status(400);
            return res.send({
                message: "Error creating."
            });
        });
    };
    return module;
};