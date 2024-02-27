# Stokwise - MERN Stack (SaaS)

**Streamline Your Inventory, Simplify Your Business**

Welcome to Stokwise, your comprehensive inventory management solution. Stokwise is a Software as a Service (SaaS) application built on the MERN (MongoDB, Express.js, React.js, Node.js) stack. It empowers organizations to efficiently manage their inventory, streamline stock tracking, record sales transactions, and analyze sales and profit data with ease.

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

organization acc - group like
	- warehouse

#### User
- type [Admin, Employee]
- ...
	
#### Product
- quantity
- Price
- ...
	
#### Create Product
- Attributes
	- Category [Electronics, food, etc...]
	- Price
	- Model
	- IMEI
	- MAC
	

## Technologies Used

- MongoDB: Database for storing inventory and user data.
- Express.js: Backend framework for building RESTful APIs.
- React.js: Frontend library for building user interfaces.
- Node.js: Server-side JavaScript runtime environment.
- Redux: State management library for React.
- Bootstrap: Frontend framework for responsive design.
- JWT: JSON Web Tokens for user authentication.
- Chart.js: Library for creating charts and graphs.
