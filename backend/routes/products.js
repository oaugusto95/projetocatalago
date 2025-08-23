const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// ROTA PARA CRIAR UM NOVO PRODUTO (POST /api/products)
router.post('/', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: "Erro ao criar produto", error: error.message });
    }
});

// ROTA PARA BUSCAR TODOS OS PRODUTOS (GET /api/products)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar produtos", error: error.message });
    }
});

// ROTA PARA BUSCAR UM PRODUTO ESPECÍFICO POR ID (GET /api/products/:id)
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar produto", error: error.message });
    }
});

module.exports = router;