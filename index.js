const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const Product = require('./models/product');
const Farm = require('./models/farm');

mongoose.connect('mongodb://127.0.0.1:27017/farmStand', { useNewURLParser: true })
	.then(() => {
		console.log("mongo connection open!")
	}) 
	.catch(err =>{
		console.log("oh no mongo error!")
		console.log(err)
	})


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// FARM ROUTES
app.get('/farms', async (req, res) => {
	const farms = await Farm.find({});
	res.render('farms/index', { farms });
})

app.get('/farms/new', async (req, res) => {
	res.render('farms/new');
})

app.get('/farms/:id', async (req, res) => {
	const farm = await Farm.findById(req.params.id)
	res.render('farms/show', { farm });
})

app.post('/farms', async (req, res) => {
	const farm = new Farm(req.body);
	await farm.save();
	res.redirect('/farms');
})

app.get('/farms/:id/products/new', async (req, res) => {
	const { id } = req.params;
	res.render('products/new', { categories });
})

app.post('/farms/:id/products', async (req, res) => {
	res.send(req.body)
})

// PRODUCT ROUTES

const categories = ['fruit', 'vegetable', 'dairy'];

app.get('/products', async (req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category })
        res.render('products/index', { products, category })
    } else {
        const products = await Product.find({})
        res.render('products/index', { products, category: 'All' })
    }
})

app.get('/products/:id', async (req, res) => {
	const { id } = req.params;
	const product = await Product.findById(id)
	console.log(product);
	res.render('products/show', { product });
}) 

app.post('/products', async (req, res) => {
	const newProduct = new Product(req.body);
	await newProduct.save();
	res.redirect(`/products/${newProduct._id}`);
});

app.listen(3000, () => {
	console.log('Listening on port 3000');
});
