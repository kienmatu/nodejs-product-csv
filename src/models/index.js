import dbConfig from "../config/db.js";
import {Sequelize} from "sequelize";

export const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
    port: dbConfig.PORT,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    },
    define: {
        timestamps: true,
        underscored: false,
    },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

export default db