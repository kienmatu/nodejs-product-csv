import Sequelize from 'sequelize';
import {sequelize} from './index.js';

const Product = sequelize.define("products", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.FLOAT
    },
    description: {
        type: Sequelize.STRING
    }
});

export default Product;