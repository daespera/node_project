module.exports = (repo, db) => {
    var module = {};

    module.insert = async (req, res) => {
        const model = await repo.create(req.body);
        if (model != undefined) {
            res.status(201);
            return res.send(model);
        }
        res.status(400);
        return res.send({
            message: "Error creating."
        });
    };

    module.list = async (req, res) => {
          const model = await repo.retrieve(req.params._id,req.query);
          if (model != undefined) {
              res.status(200);
              return res.send(model);
          }
          res.status(400);
          return res.send({
              message: "Error retrieving."
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