const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true })); // Para manejar body urlencoded

// Variable para almacenar el token
let authToken = '';

// Ruta para el login que no debe enviar la cookie
app.post('/api/login', async (req, res) => {
    try {
        const response = await axios.post('http://ng.desecloud.com/desemax_apitest/api/v1/login', req.body, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        authToken = response.data.auth;  // Suponiendo que la respuesta contiene un campo 'auth'
        res.status(200).send(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).send({ message: 'Error al iniciar sesión', error: error.message });
    }
});

// Middleware para agregar la cookie a todas las siguientes solicitudes
app.use((req, res, next) => {
    if (!authToken && req.path !== '/api/login') {
        return res.status(403).send({ message: "No autenticado" });
    }
    next();
});

// Ruta para crear clientes
app.post('/api/customers', async (req, res) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': `auth=${authToken}`
            }
        };
        const response = await axios.post('http://ng.desecloud.com/desemax_apitest/api/v1/customers', req.body, config);
        res.status(response.status).send(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).send({ message: 'Error al procesar la solicitud', error: error.message });
    }
});
app.put('/api/customers', async (req, res) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': `auth=${authToken}`
            }
        };
        const response = await axios.put('http://ng.desecloud.com/desemax_apitest/api/v1/customers', req.body, config);
        res.status(response.status).send(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).send({ message: 'Error al procesar la solicitud', error: error.message });
    }
});

// Ruta para agregar MAC Address
app.post('/api/MacAddress', async (req, res) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': `auth=${authToken}`
            }
        };
        const response = await axios.post('http://ng.desecloud.com/desemax_apitest/api/v1/cpes', req.body, config);
        res.status(response.status).send(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).send({ message: 'Error al procesar la solicitud', error: error.message });
    }
});
app.put('/api/MacAddress', async (req, res) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': `auth=${authToken}`
            }
        };
        const response = await axios.put('http://ng.desecloud.com/desemax_apitest/api/v1/cpes', req.body, config);
        res.status(response.status).send(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).send({ message: 'Error al procesar la solicitud', error: error.message });
    }
});
// Ruta para agregar cuentas
app.post('/api/accounts', async (req, res) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': `auth=${authToken}`
            }
        };
        const response = await axios.post('http://ng.desecloud.com/desemax_apitest/api/v1/accounts', req.body, config);
        res.status(response.status).send(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).send({ message: 'Error al crear la cuenta', error: error.message });
    }
});

app.put('/api/accounts', async (req, res) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': `auth=${authToken}`
            }
        };
        const response = await axios.put('http://ng.desecloud.com/desemax_apitest/api/v1/accounts', req.body, config);
        res.status(response.status).send(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).send({ message: 'Error al crear la cuenta', error: error.message });
    }
});

app.delete('/api/accounts', async (req, res) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': `auth=${authToken}`
            }
        };
        const response = await axios.delete('http://ng.desecloud.com/desemax_apitest/api/v1/accounts', req.body, config);
        res.status(response.status).send(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).send({ message: 'Error al crear la cuenta', error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Servidor intermediario corriendo en el puerto 3000');
});
