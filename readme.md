# Stockwise - MERN Stack (SaaS)

**Streamline Your Inventory, Simplify Your Business**

Welcome to Stockwise, your comprehensive inventory management solution. Stockwise is a Software as a Service (SaaS) application built on the MERN (MongoDB, Express.js, React.js, Node.js) stack. It empowers organizations to efficiently manage their inventory, streamline stock tracking, record sales transactions, and analyze sales and profit data with ease.

## Features

### 1. Product Management
- Add, edit, and delete products with details such as name, selling price, and cost price.
- Categorize products for better organization.
- View a list of all products with search and filter functionality.

### 2. Inventory Entry
- Record entries for products purchased from vendors, including quantity, purchase price, vendor information, and date of purchase.
- Automatically update inventory levels upon recording a purchase entry.

### 3. Sales Management
- Record sales transactions, including details such as the product sold, quantity, selling price, customer information, and date of sale.
- Automatically update inventory levels upon completing a sale.

### 4. Dashboard
- View key metrics such as total sales, profit margins, top-selling products, and inventory levels.
- Visualize data through charts and graphs for easy analysis.
- Monitor recent activities and transactions.

### 5. Reporting
- View sales data including total revenue, quantity sold, and profit margins.
- Generate basic reports on sales performance over time.
- Export sales and profit data in CSV format for further analysis or sharing.

### 6. User Authentication and Authorization
- Secure user authentication system for registering, logging in, and managing user accounts.
- Role-based access control to manage different levels of permissions (admin, manager, staff).

## Schema

### User
- **_id**: Unique identifier
- **username**: Username for login
- **email**: Email address
- **password**: Hashed password
- **role**: Role of the user (admin, manager, staff, etc.)
- **createdAt**: Date and time when the user was created

### Product
- **_id**: Unique identifier
- **name**: Name of the product
- **description**: Description of the product
- **category**: Category of the product (electronics, food, clothing, etc.)
- **quantity**: Quantity of the product available in stock
- **costPrice**: Cost price of the product
- **sellingPrice**: Selling price of the product
- **createdAt**: Date and time when the product was added to inventory

### Transaction
- **_id**: Unique identifier
- **type**: Type of transaction (purchase, sale, transfer, etc.)
- **productId**: Reference to the product involved in the transaction
- **quantity**: Quantity of the product involved in the transaction
- **unitPrice**: Unit price of the product in the transaction
- **totalPrice**: Total price of the transaction
- **userId**: Reference to the user who initiated the transaction
- **createdAt**: Date and time when the transaction took place

## Technologies Used

- MongoDB: Database for storing inventory and user data.
- Express.js: Backend framework for building RESTful APIs.
- React.js: Frontend library for building user interfaces.
- Node.js: Server-side JavaScript runtime environment.
- Redux: State management library for React.
- JWT: JSON Web Tokens for user authentication.
- Chart.js: Library for creating charts and graphs.
