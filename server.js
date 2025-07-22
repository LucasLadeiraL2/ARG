import express from "express";
import path from "path";
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, 'front')));

app.get('/', async (req, res) => {
    const { id, key } = req.query;
    if (id == "3692baa474d39e63f69ed504663db87f" & key == "c6d6bd7ebf806f43c76acc3681703b81") {
        res.sendFile(path.join(__dirname, 'front', 'pages', 'secret.html'));
    } else {
        res.sendFile(path.join(__dirname, 'front', 'pages', 'index.html'));
    }
});

app.get('/termos', async (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'pages', 'termos.html'));
});

app.get('/termos/privacy-policy', async (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'pages', 'privacy.html'));
});

app.get('/api/vagas', async (req, res) => {
    try {
        const dataPath = path.join(__dirname, 'vagas.json');
        const jsonData = await fs.readFile(dataPath, 'utf-8');
        const data = JSON.parse(jsonData);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao ler o arquivo JSON' });
    }
});

app.get("/proxy", async (req, res) => {
    const token = req.query.token;

    if (token == "c6d6bd7ebf806f43c76acc3681703b81") {
        try {
            const response = await fetch('https://backrooms-wiki.wikidot.com/phenomenon-5');
            let body = await response.text();

            body = body.replace(/<a\b[^>]*>(.*?)<\/a>/gi, '<span>$1</span>');

            res.send(body);

        } catch (err) {
            res.status(500).send('Erro no proxy: ' + err.message);
        }
    }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));