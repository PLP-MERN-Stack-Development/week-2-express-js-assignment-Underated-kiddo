// required modules 
const express =  require('express');
const app = express();
const PORT = 3000;

// Task 1 implementing a hello world route 
app.get('/' , (req,res) => {
    res.send('Hello World');
});

// Express server that listens on port 3000
app.listen(PORT,() =>{
    console.log(`Server is running on http://localhost:${PORT}`);
});


// Task 2 creating a resource Product
let Products = []; //this array will store the products
let nextId =1;

// JSON body parser middleware  this is in the task 3 work
app.use(express.json());

// Task 3
// middleware implementation
// logger middleware 
function logger(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method}  ${req.originalUrl}`);
    next();
}
app.use(logger);

// authentication middleware 
function authenticate(req,res,next){
    const apiKey = req.headers('x-api-key');
    if (apiKey !== 'your-secret-api-key') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}
app.use('/api', authenticate); // applies to all /api routes

// validation middleware 
function validateProduct(req, res, next) {
    const { name, description, price, category, inStock } = req.body;
    if (!name || !description || typeof price !== 'number' || !category || typeof inStock !== 'boolean') {
        return next(new ValidationError('Invalid or missing product field.'));
    }
    next();
}

// this gets all Products (with filtering & pagination)
app.get('/api/products', (req, res) => {
    let { category, page = 1, limit = 10 } = req.query;
    let results = Products;

    // Filter by category if provided
    if (category) {
        results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Pagination
    page = parseInt(page);
    limit = parseInt(limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedResults = results.slice(start, end);

    res.json({
        total: results.length,
        page,
        limit,
        products: paginatedResults
    });
});

// posts a new product 
app.post('/api/products', validateProduct, (req, res) => {
    const { name, description, price, category, inStock } = req.body;
    const newProduct = {
        id: nextId++,
        name,
        description,
        price,
        category,
        inStock
    };
    Products.push(newProduct);
    res.status(201).json(newProduct);
});

// getting a specific product by id 
app.get('/api/products/:id', (req, res, next) => {
    const productId = parseInt(req.params.id);
    const product = Products.find(p => p.id === productId);
    if (!product) {
        return next(new NotFoundError('Product not found.'));
    }
    res.json(product);
});

// updating an existing  product
app.put('/api/products/:id', validateProduct, (req, res, next) => {
    const product = Products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return next(new NotFoundError('Product not found.'));
    }
    const { name, description, price, category, inStock } = req.body;
    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.inStock = inStock;

    res.json(product);
});

// deleting a product 
app.delete('/api/products/:id', (req, res, next) => {
    const index = Products.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
        return next(new NotFoundError('Product not found.'));
    }
    const deleted = Products.splice(index, 1);
    res.json(deleted[0]);
});

// Search endpoint by name
app.get('/api/products/search', (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ error: 'Please provide a name to search.' });
    }
    const results = Products.filter(p =>
        p.name.toLowerCase().includes(name.toLowerCase())
    );
    res.json({ total: results.length, products: results });
});

// Product statistics endpoint
app.get('/api/products/stats', (req, res) => {
    const stats = {};
    Products.forEach(p => {
        stats[p.category] = (stats[p.category] || 0) + 1;
    });
    res.json({ countByCategory: stats });
});

// Task 4 error handling middleware
// Custom error classes
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
        this.status = 404;
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
        this.status = 400;
    }
}

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.name || "InternalServerError",
        message: err.message || "Something went wrong"
    });
});

// task 5 is mixed in the others 