import Product from "../models/product.js";

export const findOneProduct = (req, res) => {
    const id = req.params.id;
    Product.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Product with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Product with id=" + id
            });
        });
}

export const findManyProducts = (req, res) => {
    Product.findAll({
        limit: 1000
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err
            });
        });
}

export const importProducts = (req, res) => {
    res.status(200);
    res.send("Welcome to root URL of Server");
}

export const exportProducts = (req, res) => {
    res.status(200);
    res.send("Welcome to root URL of Server");
}