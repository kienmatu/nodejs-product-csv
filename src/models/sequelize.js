import dbConfig from "../config/db.js";
import {Sequelize} from "sequelize";
import colors from "colors";

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
    benchmark: true,
    logging: (message, execTime) => {
        if (message.length > 500) {
            message = message.slice(0, 500) + '... (truncated)';
            // You can use something like cloud logging...
        }
        let color = colors.blue.bold;
        if (execTime && execTime >= 30) {
            color = colors.red.bold;
        }

        console.log(colors.magenta.bold(`[${execTime} ms]`), color(message));
    }
});


sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

export default sequelize