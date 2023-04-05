import {faker} from '@faker-js/faker';
import {createObjectCsvWriter} from 'csv-writer';

const generateProductsCsv = (rows) => {
    const csvWriter = createObjectCsvWriter({
        path: `./sample-csv/products-${rows}-rows.csv`,
        header: [
            {id: 'name', title: 'name'},
            {id: 'price', title: 'price'},
            {id: 'description', title: 'description'},
        ]
    });

    const data = [];
    for (let i = 0; i < rows; i++) {
        data.push({
            name: faker.commerce.productName(),
            price: faker.commerce.price(),
            description: faker.commerce.productDescription(),
        });
    }

    csvWriter.writeRecords(data)
        .then(() => console.log('CSV file generated successfully'))
        .catch((error) => console.error(error));
}
const rows = [100, 1000, 10000, 100000, 1000000];
console.log("GENERATING CSV...")
rows.forEach(x => generateProductsCsv(x));