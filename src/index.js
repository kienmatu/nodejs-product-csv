import express from 'express';
import {getManyProducts, getSingleProduct, importProducts, exportProducts} from "./handlers.js";

const app = express();

app.get('/products', getManyProducts);
app.get('/products/:id', getSingleProduct);
app.post('/products/import', importProducts);
app.get('/products/export', exportProducts);

app.listen(PORT, (error) =>{
        if(!error)
            console.log("App is listening on port "+ PORT)
    else
        console.log("Error occurred, server can't start", error);
    }
);