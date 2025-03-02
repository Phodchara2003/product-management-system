# Product Management System

This project is a Product Management System that allows an admin user to manage products through a web interface. The system includes functionalities for user registration, login, and product management, including adding, editing, deleting, and searching for products.

## Features

- **User Authentication**: Admins can register and log in to the system.
- **Product Management**: Admins can add, edit, delete, and view products.
- **Search Functionality**: Admins can search for products by various criteria.

## Tech Stack

- **Frontend**: EJS templating engine, Bootstrap CSS for styling
- **Backend**: Node.js with Express framework
- **Database**: SQL database for storing user and product information

## Project Structure

```
product-management-system
├── src
│   ├── config
│   │   └── database.js
│   ├── controllers
│   │   ├── authController.js
│   │   └── productController.js
│   ├── middlewares
│   │   └── authMiddleware.js
│   ├── models
│   │   ├── Admin.js
│   │   └── Product.js
│   ├── routes
│   │   ├── authRoutes.js
│   │   └── productRoutes.js
│   └── views
│       ├── auth
│       │   ├── login.ejs
│       │   └── register.ejs
│       ├── layouts
│       │   └── main.ejs
│       ├── partials
│       │   ├── header.ejs
│       │   ├── footer.ejs
│       │   └── navbar.ejs
│       └── products
│           ├── add.ejs
│           ├── edit.ejs
│           ├── index.ejs
│           └── search.ejs
├── public
│   ├── css
│   │   └── style.css
│   ├── js
│   │   └── script.js
│   └── uploads
├── app.js
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/product-management-system.git
   ```
2. Navigate to the project directory:
   ```
   cd product-management-system
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Set up the database configuration in `src/config/database.js`.
5. Start the application:
   ```
   npm start
   ```

## Usage

- Access the application in your web browser at `http://localhost:3000`.
- Register as an admin user to access the product management features.
- Use the navigation bar to add, edit, delete, and search for products.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features you would like to add.

## License

This project is licensed under the MIT License.