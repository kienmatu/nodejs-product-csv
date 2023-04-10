const dbConfig = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "password1",
    PORT: "5433",
    DB: "postgres",
    dialect: "postgres",
    pool: {
        max: 16, // max pool size
        min: 1, // min pool size
        acquire: 3000, // timeout to wait connection in  milliseconds
        idle: 10000 // idle time in milliseconds
    }
};

export default dbConfig;