const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

const Product = require('./models/product');

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

app.get('/products', async (req, res) => {
	const products = await Product.find({})
	res.render('products/index', { products });
})

app.get('/products/:id', async (req, res) => {
	const { id } = req.params;
	const product = await Product.findById(id)
	console.log(product);
	res.render('products/show', { product });
})

app.listen(3000, () => {
	console.log('Listening on port 3000');
});
