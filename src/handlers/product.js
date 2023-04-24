import {Category, Product} from "../models/index.js";
import csv from "fast-csv"
import fs from "fs";
import {createObjectCsvWriter} from "csv-writer";
import appDir from "../utils/pathHelper.js";
import sequelize from "../models/sequelize.js";

export const findOneProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const product = await Product.findByPk(id, {
            include: [{
                model: Category
            }],
        })
        if (product) {
            res.send({
                message: 'OK', data: product
            });
        } else {
            res.status(404).send({
                message: `Cannot find Product with id=${id}.`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: `Error retrieving Product with id=${id}`, error: err
        });
    }
}

export const findManyProducts = async (req, res) => {
    try {
        // should add pagination.
        const products = await Product.findAll({
            limit: 200, include: [{// Notice `include` takes an ARRAY
                model: Category
            }], order: [['updatedAt', 'DESC'], ['createdAt', 'DESC']]
        })
        res.send({
            message: 'OK', data: products
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: 'internal error', err: err
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
    let path = appDir + "static/uploads/" + req.file.filename;
    const categories = await Category.findAll({
        attributes: ['id', 'name', 'code']
    })
    const categoryMap = new Map(categories.map(c => {
        return [c.dataValues.code, c.dataValues];
    }),);
    const t = await sequelize.transaction();
    console.log("START PROCESSING CSV");
    try {
        let rowNumber = 1;
        let products = [];
        const bulkJobs = [];
        const startTime = Date.now();

        const parser = csv.parse({headers: true})
            .on('error', async (err) => {
                console.error(err.message);
                await fs.promises.unlink(path);
                res.status(400).send({
                    message: 'Bad request', err: err.message
                });
            })
            .on('data', async (data) => {
                const category = categoryMap.get(data.categoryCode)
                if (!category) {
                    throw new Error(`Row ${rowNumber}, category not found.\nData: ${JSON.stringify(data)}`)
                }
                const now = new Date(startTime + rowNumber);
                products.push({
                    ...data, categoryId: category.id, createdAt: now, updatedAt: now,
                });
                if (products.length >= 999) {
                    console.log(`Processed ${rowNumber} rows.`)
                    // Import the products into the database
                    bulkJobs.push(Product.bulkCreate(products));
                    products = [];
                }

                rowNumber++;
            })
            .on('end', async () => {
                // Remove the uploaded file after parsing
                await fs.promises.unlink(path);
                if (products.length > 0) {
                    // Import the products into the database
                    bulkJobs.push(Product.bulkCreate(products));
                    products = [];
                }
                await Promise.all(bulkJobs);

                await t.commit();
                res.status(200).send({message: 'Products imported successfully'});
            });

        fs.createReadStream(path).pipe(parser);
    } catch (err) {
        await t.rollback();
        console.error(err.message);
        res.status(500).send({
            message: 'Internal server error', error: err
        });
    }
}

export const exportProducts = async (req, res) => {
    let limit = req.query.limit || 100000;
    if (!limit || limit > 1000000) {
        limit = 1000000;
    }
    const products = await Product.findAll({
        limit: limit, attributes: ['name', 'price', 'description'], include: [{
            model: Category, attributes: ['code']
        }], subQuery: false, raw: true
    });
    const dir = appDir + 'static/exports';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
    }
    const fileName = `${dir}/${process.hrtime.bigint()}-products.csv`;
    const csvWriter = createObjectCsvWriter({
        path: fileName,
        header: [{id: 'name', title: 'name'}, {id: 'price', title: 'price'}, {
            id: 'category.code',
            title: 'categoryCode'
        }, {id: 'description', title: 'description'},]
    });
    await csvWriter.writeRecords(products)
        .then(async () => {
            console.log('CSV file exported successfully');
            await fs.readFile(fileName, "UTF-8", function (err, data) {
                if (err) {
                    console.error(err)
                    res.status(500).send(err)
                }
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
                res.send(data);
            })
        })
        .catch(async (err) => {
            console.error(err)
            res.status(500).send(err);
        })
        .finally(async () => {
            await fs.unlink(fileName, () => {
                console.log("DELETED THE TEMP FILE")
            });
        });
}