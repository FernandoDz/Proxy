const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const bodyParser = require('body-parser');
const axios = require('axios'); // Descomentar esta línea

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:7160');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Proxy configuration
app.use('/api', createProxyMiddleware({
    target: 'http://201.247.100.129/CommerceService/UCJson.svc',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '', // remove /api prefix
    },
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('Access-Control-Allow-Origin', '*');
    }
}));

app.post('/ContactCreate', async (req, res) => {
    try {
        console.log('Cuerpo de la solicitud:', req.method, req.url, req.body);

        const response = await axios.post('http://201.247.100.129/CommerceService/UCJson.svc/ContactCreate', req.body, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        res.status(response.status).send(response.data);
    } catch (error) {
        console.error('Error al crear el contacto:', error);
        res.status(500).send('Hubo un error al crear el contacto.');
    }
});

// Puerto en el que escuchará el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log("servidor corriendo en el puerto"+PORT);
});