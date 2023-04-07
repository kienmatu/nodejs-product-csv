import express from 'express';
import {exportProducts, findManyProducts, findOneProduct, importProducts} from "./handlers/product.js";
import {index} from "./handlers/index.js";
import uploadMiddleware from './middlewares/fileUpload.js';
import path from "path"
import logger from "./middlewares/logger.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const PORT = process.env.PORT || 8080;
const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

app.use(logger);

// routing
app.get('/', index)
app.get('/api/products', findManyProducts);
app.post('/api/products/import', uploadMiddleware.single('file'), importProducts);
app.get('/api/products/export', exportProducts);
app.get('/api/products/:id', findOneProduct);

app.listen(PORT, (error) => {
        if (!error) {
            console.log("App is listening on port " + PORT)
        } else {
            console.log("Error occurred, server can't start", error);
        }
    }
);