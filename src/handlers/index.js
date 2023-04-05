import Product from "../models/product.js";

export const index = async (req, res) => {
    try {
        const perPage = 20;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * perPage;

        const products = await Product.findAndCountAll({
            limit: perPage,
            offset: offset,
            order: [['updatedAt', 'DESC'], ['createdAt', 'DESC']]
        });

        const pageCount = Math.ceil(products.count / perPage);
        const pages = [];
        for (let i = 1; i <= pageCount; i++) {
            pages.push(i);
        }

        res.render('../static/views/index', {
            products: products.rows,
            pages: pages,
            totalPages: pages.length,
            currentPage: page
        });
    } catch (e) {
        console.error(e)
        res.render('../static/views/index');
    }

}
