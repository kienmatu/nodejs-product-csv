import Sequelize from 'sequelize';
import sequelize from './sequelize.js';

const ProductInit = sequelize.define("products", {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
    },
    price: {
        type: Sequelize.FLOAT,
    },
    description: {
        type: Sequelize.STRING,
    },
    categoryId: {
        type: Sequelize.UUID,
    },
    createdAt: {
        type: Sequelize.DATE,
    },
    updatedAt: {
        type: Sequelize.DATE,
    }
});


export default ProductInit;