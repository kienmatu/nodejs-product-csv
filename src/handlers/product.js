import {Category, Product} from "../models/index.js";
import csv from "fast-csv"
import fs from "fs";
import {createObjectCsvWriter} from "csv-writer";
import appDir from "../utils/pathHelper.js";
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
                message: `Error retrieving Product with id=${id}`,
                error: err
            });
        });
}

export const findManyProducts = async (req, res) => {
    try {
        // should add pagination.
        const products = await Product.findAll({
            limit: 200,
            include: [{// Notice `include` takes an ARRAY
                model: Category
            }],
            order: [['updatedAt', 'DESC'], ['createdAt', 'DESC']]
        })
        res.send({
            message: 'OK',
            data: products
        });
    }
    catch(err) {
        console.error(err);
        res.status(500).send({
            message: 'internal error',
            err: err
        });
    }
}

export const importProducts = async (req, res) => {
    if (!req.file) {
        console.log(req.file)
        res.status(400).send({
            message: 'No file is uploaded'
        });
        return;
    }
    const rows = [];
    let path = appDir + "static/uploads/" + req.file.filename;
    const categories = await Category.findAll({
        attributes: ['id', 'name', 'code']
    })
    const categoryMap = new Map(
        categories.map(c => {
            return [c.dataValues.code, c.dataValues];
        }),
    );
    try {
        let rowNumber = 1;
        const parser = csv.parse({headers: true})
            .on('error', async (err) => {
                console.error(err.message);
                await fs.promises.unlink(path);
                res.status(400).send({message: err.message});
            })
            .on('data', (data) => {
                const category = categoryMap.get(data.categoryCode)
                if (!category) {
                    throw new Error(`Row ${rowNumber}, category not found.\nData: ${JSON.stringify(data)}`)
                }
                rows.push({...data, categoryId: category.id});

                rowNumber++;
            })
            .on('end', async () => {
                // Remove the uploaded file after parsing
                await fs.promises.unlink(path);

                // Map the parsed data into the Product model
                const products = rows.map(({name, price, description, categoryId}) => ({
                    name,
                    price,
                    description,
                    categoryId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }));

                // Import the products into the database
                await Product.bulkCreate(products);

                res.status(200).send({message: 'Products imported successfully'});
            });

        fs.createReadStream(path).pipe(parser);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({message: 'Internal server error'});
    }
}

export const exportProducts = async (req, res) => {
    let limit = req.params.limit;
    if (!limit || limit > 1000000) {
        limit = 1000000;
    }
    const products = await Product.findAll({
        limit: limit
        });
    const dir = appDir + 'static/exports';

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
            {id: 'categoryCode', title: 'categoryCode'},
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
                    console.log("DELETED THE TEMP FILE")
                });
            }
        );
}