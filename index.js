// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session');

const app = express();
const port = 3000;

app.use(session({
    secret: 'mySecretKey', // Chave secreta para assinar o cookie da sessão
    resave: false,
    saveUninitialized: false
}));

// Array com as credenciais do usuário
const usuarios = [
    { id: 1, email: 'usuario1@example.com', password: 'senha1' },
    { id: 2, email: 'usuario2@example.com', password: 'senha2' },
    { id: 3, email: 'usuario3@example.com', password: 'senha3' }

];

// Configurações do Express
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Rota para a página de login
app.get('/', (req, res) => {
    res.render('index');
});

// Rota para autenticação
app.post('/auth', (req, res) => {
    const { email, password } = req.body;
    const usuarioValido = usuarios.find(user => user.email === email && user.password === password);
    if (usuarioValido) {
        req.session.user = usuarioValido; // Armazenar dados do usuário na sessão
        res.cookie('autenticado', true);
        res.redirect('/pagina_usuario');
    } else {
        // Usuário ou senha incorretos
        res.redirect('/?error=true');
    }
});

// Middleware para verificar se o usuário está autenticado
app.use((req, res, next) => {
    if (req.cookies.autenticado) {
        next();
    } else {
        res.redirect('/');
    }
});

// Rota para a página do usuário
app.get('/pagina_usuario', (req, res) => {
    res.render('pagina_usuario', { usuario: req.session.user.email });
});


// Rota para logout
app.get('/logout', (req, res) => {
    res.clearCookie('autenticado');
    res.redirect('/');
});

// Rota para abrir a página de login
app.get('/', (req, res) => {
    // Verificar se há uma mensagem de erro na query string
    const errorMessage = req.query.error ? 'Credenciais inválidas! Tente novamente.' : null;
    res.render('index', { error: errorMessage }); // Passar a mensagem de erro para o modelo
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});