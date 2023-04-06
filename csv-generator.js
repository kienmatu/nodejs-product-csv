import {faker} from '@faker-js/faker';
import {createObjectCsvWriter} from 'csv-writer';

const categories = [
    {
        id: "b2ff1377-c40c-4c10-b3a4-4d12c2f90bca",
        name: "Electronics",
        description: "Category for electronic devices",
        code: "ELC"
    },
    {
        id: "8c054e34-e65d-4b6e-b7f1-9d9b556e10d1",
        name: "Clothing",
        description: "Category for clothing items",
        code: "CLT"
    },
    {
        id: "a18b11cc-9a2e-4a04-b831-dde4667e8e0a",
        name: "Books",
        description: "Category for books and literature",
        code: "BKS"
    },
    {
        id: "773e7aa3-f06d-42af-a8c3-3cb50d966f26",
        name: "Home & Kitchen",
        description: "Category for home and kitchen products",
        code: "HKP"
    },
    {
        id: "b8f3c3eb-30f6-41dd-a7b8-518ff2db616f",
        name: "Health & Beauty",
        description: "Category for health and beauty products",
        code: "HBP"
    },
    {
        id: "5c6f5df6-5c5f-4a69-a38c-95d330c156e2",
        name: "Toys & Games",
        description: "Category for toys and games",
        code: "TNG"
    },
    {
        id: "54b31c80-38f6-4e6a-9f70-049a8e0905c9",
        name: "Sports & Outdoors",
        description: "Category for sports and outdoor products",
        code: "SPO"
    },
    {
        id: "66d74c4b-4b4d-4a54-935d-6b0b6faa07f4",
        name: "Automotive",
        description: "Category for automotive products",
        code: "AUT"
    },
    {
        id: "23212a97-74af-460e-bd3d-7b1320dd1c25",
        name: "Office Products",
        description: "Category for office supplies and stationery",
        code: "OFS"
    },
    {
        id: "141d2f17-91d8-4f9d-9143-3b8213c6f5a5",
        name: "Pet Supplies",
        description: "Category for pet supplies and accessories",
        code: "PET"
    }
];

const categoryCodes = categories.map(c => c.code);

const generateProductsCsv = (rows) => {
    const csvWriter = createObjectCsvWriter({
        path: `./bench/sample-csv/products-${rows}-rows.csv`,
        header: [
            {id: 'name', title: 'name'},
            {id: 'price', title: 'price'},
            {id: 'description', title: 'description'},
            {id: 'categoryCode', title: 'categoryCode'},
        ]
    });

    const data = [];
    for (let i = 0; i < rows; i++) {
        data.push({
            name: faker.commerce.productName(),
            price: faker.commerce.price(),
            description: faker.commerce.productDescription(),
            categoryCode: faker.helpers.arrayElement(categoryCodes),
        });
    }

    csvWriter.writeRecords(data)
        .then(() => console.log(`CSV file generated successfully with ${rows} rows`))
        .catch((error) => console.error(error));
}
const rows = [10, 100, 1000, 10000, 100000, 1000000];
console.log("GENERATING CSV...")
rows.forEach(x => generateProductsCsv(x));