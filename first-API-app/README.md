# Express.js Products API

A simple RESTful API built with Express.js for managing products, featuring CRUD operations, middleware, error handling, filtering, pagination, search, and statistics.

## 🚀 Features

- **CRUD**: Create, Read, Update, Delete products
- **Middleware**: Logging, authentication, validation
- **Error Handling**: Custom error classes and global error handler
- **Advanced**: Filtering by category, pagination, search by name, product statistics

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)

### Installation

1. Clone this repository:
    ```sh
    git clone <your-repo-url>
    cd week-2-express-js-assignment-Underated-kiddo/first-API-app
    ```

2. Install dependencies:
    ```sh
    npm install express
    ```

### Running the Server

```sh
node server.js
```

The server will run at [http://localhost:3000](http://localhost:3000)

---

## 🔑 Authentication

All `/api` routes require an API key in the request headers:

```
x-api-key: your-secret-api-key
```

---

## 📦 API Endpoints

### Basic

- `GET /`  
  Returns "Hello World".

### Products

- `GET /api/products`  
  List all products.  
  Supports:
    - `category` (query): filter by category  
    - `page` (query): page number (default: 1)  
    - `limit` (query): items per page (default: 10)

- `POST /api/products`  
  Create a new product.  
  **Body:**  
  ```json
  {
    "name": "Product Name",
    "description": "Product Description",
    "price": 100,
    "category": "Category",
    "inStock": true
  }
  ```

- `GET /api/products/:id`  
  Get a product by ID.

- `PUT /api/products/:id`  
  Update a product by ID.  
  **Body:** Same as POST.

- `DELETE /api/products/:id`  
  Delete a product by ID.

### Advanced

- `GET /api/products/search?name=foo`  
  Search products by name.

- `GET /api/products/stats`  
  Get product count by category.

---

## 📝 Error Handling

- Returns JSON error responses with appropriate HTTP status codes.
- Custom errors: `NotFoundError`, `ValidationError`.

---

## 🧪 Example Request

```sh
curl -H "x-api-key: your-secret-api-key" http://localhost:3000/api/products
```
