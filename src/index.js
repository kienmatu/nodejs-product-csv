import express from 'express';
import {exportProducts, findManyProducts, findOneProduct, importProducts} from "./handlers/product.js";
import {index} from "./handlers/index.js";

const PORT = process.env.PORT || 3000;
const app = express();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

app.get('/', index)
app.get('/api/products', findManyProducts);
app.get('/api/products/:id', findOneProduct);
app.post('/api/products/import', importProducts);
app.get('/api/products/export', exportProducts);

app.listen(PORT, (error) => {
        if (!error) {
            console.log("App is listening on port " + PORT)
        } else {
            console.log("Error occurred, server can't start", error);
        }

    }
);