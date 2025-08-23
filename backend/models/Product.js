const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Ex: "Cor", "Tamanho", "Quantidade"
    values: [{ type: String, required: true }] // Ex: ["Vermelho", "Azul"], ["P", "M", "G"]
});

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    images: [{
        type: String // Array de URLs das imagens
    }],
    options: [OptionSchema] // Array de opções como cor, tamanho, etc.
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);