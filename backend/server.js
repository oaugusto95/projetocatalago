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

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Conexão MongoDB
mongoose.connect('mongodb+srv://<oswaldoaugustopinto>:<gu9314guto>@cluster0.mongodb.net/meusite?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB conectado'))
  .catch(err => console.log(err));

// Modelo de usuário
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// Rota de login
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Usuário não encontrado' });

        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) return res.status(400).json({ msg: 'Senha incorreta' });

        res.json({ msg: 'Login efetuado com sucesso', user: { email: user.email } });
    } catch (err) {
        res.status(500).json({ msg: 'Erro no servidor' });
    }
});

// Rota de cadastro
app.post('/register', async (req, res) => {
    const { email, senha } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'Usuário já existe' });

        const salt = await bcrypt.genSalt(10);
        const hashSenha = await bcrypt.hash(senha, salt);

        user = new User({ email, senha: hashSenha });
        await user.save();
        res.json({ msg: 'Usuário cadastrado com sucesso' });
    } catch (err) {
        res.status(500).json({ msg: 'Erro no servidor' });
    }
});

// Inicia servidor
app.listen(3000, () => console.log('Servidor rodando na porta 3000'));

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // pasta pública para imagens

// Conexão MongoDB
mongoose.connect('mongodb+srv://<oswaldoaugustopinto>:<gu9314guto>@cluster0.mongodb.net/meusite?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB conectado'))
  .catch(err => console.log(err));

// Configuração Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Modelo de usuário
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    avatar: { type: String } // caminho da imagem
});

const User = mongoose.model('User', UserSchema);

// Cadastro de usuário com upload
app.post('/register', upload.single('avatar'), async (req, res) => {
    const { email, senha } = req.body;
    const avatar = req.file ? req.file.filename : null;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'Usuário já existe' });

        const salt = await bcrypt.genSalt(10);
        const hashSenha = await bcrypt.hash(senha, salt);

        user = new User({ email, senha: hashSenha, avatar });
        await user.save();
        res.json({ msg: 'Usuário cadastrado com sucesso' });
    } catch (err) {
        res.status(500).json({ msg: 'Erro no servidor' });
    }
});

// Login de usuário
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Usuário não encontrado' });

        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) return res.status(400).json({ msg: 'Senha incorreta' });

        res.json({ msg: 'Login efetuado com sucesso', user: { email: user.email, avatar: user.avatar } });
    } catch (err) {
        res.status(500).json({ msg: 'Erro no servidor' });
    }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Conexão MongoDB Atlas
mongoose.connect('mongodb+srv://<oswaldoaugustopinto>:<gu9314guto>@cluster0.mongodb.net/meusite?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB conectado'))
  .catch(err => console.log(err));

// Modelo de usuário
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// Rota de cadastro
app.post('/register', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ msg: 'Usuário já existe' });

        const salt = await bcrypt.genSalt(10);
        const hashSenha = await bcrypt.hash(senha, salt);

        const user = new User({ email, senha: hashSenha });
        await user.save();

        res.json({ msg: 'Usuário cadastrado com sucesso' });
    } catch (err) {
        res.status(500).json({ msg: 'Erro no servidor' });
    }
});

// Rota de login
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Usuário não encontrado' });

        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) return res.status(400).json({ msg: 'Senha incorreta' });

        res.json({ msg: 'Login efetuado com sucesso', user: { email: user.email } });
    } catch (err) {
        res.status(500).json({ msg: 'Erro no servidor' });
    }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
