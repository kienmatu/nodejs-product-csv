import Product from "../models/product.js";
import csv from "fast-csv"
import fs from "fs";

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
        limit: 1000,
        order: ['updatedAt', 'desc']
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
    try {
        if (!req.file) {
            throw new Error('No file uploaded');
        }

        const rows = [];
        let path = "./static/uploads/" + req.file.filename;

        const parser = csv.parse({headers: true})
            .on('error', (error) => {
                console.error(error);
                throw new Error('Error parsing CSV data');
            })
            .on('data', (data) => {
                console.log(data);
                rows.push(data);
            })
            .on('end', async () => {
                // Remove the uploaded file after parsing
                await fs.promises.unlink(path);

                // Map the parsed data into the Product model
                const products = rows.map(({name, price, description}) => ({
                    name,
                    price,
                    description,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }));
                console.log(products)

                // Import the products into the database
                await Product.bulkCreate(products);

                res.status(200).send('Products imported successfully');
            });

        fs.createReadStream(path).pipe(parser);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
}

export const exportProducts = (req, res) => {
    res.status(200);
    res.send("Welcome to root URL of Server");
}