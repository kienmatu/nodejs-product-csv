import Sequelize from 'sequelize';
import sequelize from './sequelize.js';

const CategoryInit = sequelize.define("categories", {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
    code: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: Sequelize.DATE,
    },
    updatedAt: {
        type: Sequelize.DATE,
    }
});

export default CategoryInit;