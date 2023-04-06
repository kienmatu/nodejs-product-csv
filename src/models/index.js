import Product from "./product.js";
import Category from "./category.js";
import Sequelize from "sequelize";

Category.Products = Category.hasMany(Product,
    {
        foreignKey: {
            name: 'categoryId',
            type: Sequelize.UUID
        }
    }
);

Product.belongsTo(Category, {
    foreignKey: {
        name: 'categoryId',
        type: Sequelize.UUID
    }
});

export {Product, Category}