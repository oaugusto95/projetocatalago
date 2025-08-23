// Importa as bibliotecas
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Carrega as variáveis do arquivo .env

// Cria o aplicativo express
const app = express();

// Configura middlewares
app.use(cors()); // Permite requisições de outras origens
app.use(express.json()); // Permite que o servidor entenda JSON

// Conecta ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Conectado ao MongoDB com sucesso!");
}).catch((err) => {
    console.error("Erro ao conectar ao MongoDB:", err);
});

// Usa as rotas de produtos
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes); // Todas as rotas em products.js começarão com /api/products

// Inicia o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});