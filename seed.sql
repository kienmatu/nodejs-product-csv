-- We need double quoted the column names to preserve the case.
CREATE TABLE IF NOT EXISTS categories
(
    id          VARCHAR(36) PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    code        VARCHAR(12)  NOT NULL,
    "createdAt" TIMESTAMP    NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products
(
    id           VARCHAR(36) PRIMARY KEY,
    name         VARCHAR(255)   NOT NULL,
    price        NUMERIC(10, 2) NOT NULL,
    description  TEXT,
    "categoryId" VARCHAR(36)    NOT NULL,
    "createdAt"  TIMESTAMP      NOT NULL DEFAULT NOW(),
    "updatedAt"  TIMESTAMP      NOT NULL DEFAULT NOW(),
    CONSTRAINT products_categoryId_fk FOREIGN KEY ("categoryId") REFERENCES categories (id) ON DELETE CASCADE
);
INSERT INTO categories (id, name, description, code)
VALUES ('b2ff1377-c40c-4c10-b3a4-4d12c2f90bca', 'Electronics', 'Category for electronic devices', 'ELC'),
       ('8c054e34-e65d-4b6e-b7f1-9d9b556e10d1', 'Clothing', 'Category for clothing items', 'CLT'),
       ('a18b11cc-9a2e-4a04-b831-dde4667e8e0a', 'Books', 'Category for books and literature', 'BKS'),
       ('773e7aa3-f06d-42af-a8c3-3cb50d966f26', 'Home & Kitchen', 'Category for home and kitchen products', 'HKP'),
       ('b8f3c3eb-30f6-41dd-a7b8-518ff2db616f', 'Health & Beauty', 'Category for health and beauty products', 'HBP'),
       ('5c6f5df6-5c5f-4a69-a38c-95d330c156e2', 'Toys & Games', 'Category for toys and games', 'TNG'),
       ('54b31c80-38f6-4e6a-9f70-049a8e0905c9', 'Sports & Outdoors', 'Category for sports and outdoor products', 'SPO'),
       ('66d74c4b-4b4d-4a54-935d-6b0b6faa07f4', 'Automotive', 'Category for automotive products', 'AUT'),
       ('23212a97-74af-460e-bd3d-7b1320dd1c25', 'Office Products', 'Category for office supplies and stationery',
        'OFS'),
       ('141d2f17-91d8-4f9d-9143-3b8213c6f5a5', 'Pet Supplies', 'Category for pet supplies and accessories', 'PET');
