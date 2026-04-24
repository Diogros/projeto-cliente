const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

console.log("Conteúdo da variável mysql:", mysql);
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: '',      
    database: 'sistema' 
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err);
        return;
    }
    console.log('Conectado ao MySQL com sucesso!');
});

app.get('/cliente', (req, res) => {
    const sql = "SELECT * FROM cliente";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

app.get('/cliente/:id', (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM cliente WHERE id_clientes = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result[0]);
    });
});

app.post('/cliente', (req, res) => {
    const { nome, email, cpf, nascimento, telefone } = req.body;
    const sql = "INSERT INTO cliente (nome, email, cpf, nascimento, telefone) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [nome, email, cpf, nascimento, telefone], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Cadastrado!", id: result.insertId });
    });
});

app.put('/cliente/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email, cpf, nascimento, telefone } = req.body;
    const sql = "UPDATE cliente SET nome=?, email=?, cpf=?, nascimento=?, telefone=? WHERE id_clientes=?";
    db.query(sql, [nome, email, cpf, nascimento, telefone, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Atualizado!" });
    });
});

app.delete('/cliente/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM cliente WHERE id_clientes = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Excluído!" });
    });
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});