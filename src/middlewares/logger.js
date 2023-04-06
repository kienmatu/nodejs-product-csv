const logger = (req, res, next) => {
    res.on('finish', () => {
        console.log('\x1b[32m', `\x1b[42m\x1b[90mHTTP ${req.method}\x1b[0m`, req.url,
            res.statusCode >= 500 ? '\x1b[41m' : res.statusCode >= 400 ? '\x1b[31m' :
                res.statusCode >= 300 ? '\x1b[36m' : res.statusCode >= 200 ? '\x1b[32m' : '\x1b[0m',
            res.statusCode, '\x1b[0m', new Date().toISOString());
    })
    next();
}
export default logger;