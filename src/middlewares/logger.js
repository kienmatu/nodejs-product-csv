import colors from "colors";

const logger = (req, res, next) => {
    let startTime = new Date();
    res.on('finish', () => {
        const endTime = new Date();
        let color;
        if (res.statusCode >= 500) {
            color = colors.red.bold;
        } else if (res.statusCode >= 300) {
            color = colors.yellow.bold;
        } else {
            color = colors.green.bold;
        }
        console.log(color(`[${(endTime.getTime() - startTime.getTime())} ms] ${req.method} ${req.originalUrl}: ${res.statusCode}`), new Date().toISOString());
    })
    next();
}
export default logger;