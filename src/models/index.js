import ProductInit from "./productInit.js";
import CategoryInit from "./categoryInit.js";
import Sequelize from "sequelize";

CategoryInit.Products = CategoryInit.hasMany(ProductInit,
    {
        foreignKey: {
            name: 'categoryId',
            type: Sequelize.UUID
        }
    }
);

ProductInit.belongsTo(CategoryInit, {
    foreignKey: {
        name: 'categoryId',
        type: Sequelize.UUID
    }
});

export {ProductInit as Product, CategoryInit as Category}