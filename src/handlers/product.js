import Product from "../models/product.js";
import csv from "fast-csv"
import fs from "fs";
import {createObjectCsvWriter} from "csv-writer";

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

export const importProducts = async (req, res) => {
    if (!req.file) {
        res.status(400).send('No file is uploaded');
        return;
    }
    const rows = [];
    let path = "./static/uploads/" + req.file.filename;
    try {
        const parser = csv.parse({headers: true})
            .on('error', (error) => {
                //TODO: Try catch on callback doesnt work
                console.error(error);
                throw new Error('Error parsing CSV data');
            })
            .on('data', (data) => {
                // console.log(data);
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

export const exportProducts = async (req, res) => {
    const products = await Product.findAll();
    const dir = './static/exports';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
    }
    const fileName = `${dir}/${Date.now()}-products.csv`;
    const csvWriter = createObjectCsvWriter({
        path: fileName,
        header: [
            {id: 'name', title: 'name'},
            {id: 'price', title: 'price'},
            {id: 'description', title: 'description'},
        ]
    });
    await csvWriter.writeRecords(products)
        .then(async () => {
                console.log('CSV file exported successfully');
                await fs.readFile(fileName, "UTF-8", function (err, data) {
                    if (err) {
                        res.status(500).send(err)
                    }
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
                    res.send(data);
                })
            }
        )
        .catch(async (err) => {
            res.status(500).send(err);
        })
        .finally(async () => {
                await fs.unlink(fileName, () => {
                    "DELETED THE TEMP FILE"
                });
            }
        );
}