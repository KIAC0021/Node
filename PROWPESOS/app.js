const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Endpoint para convertir pesos a dólares
app.post('/convertir-pesos-dolares', (req, res) => {

    const { pesos } = req.body;

    const cantidadPesos = parseFloat(pesos);
    const tipoCambio = 20.50; // Tipo de cambio fijo

    if (isNaN(cantidadPesos) || cantidadPesos < 0) {
        return res.status(400).json({ error: "Cantidad inválida" });
    }

    const dolares = cantidadPesos / tipoCambio;

    res.json({
        pesos: cantidadPesos,
        dolares: dolares,
        tipoCambio: tipoCambio
    });

});

// Endpoint para convertir dólares a pesos
app.post('/convertir-dolares-pesos', (req, res) => {

    const { dolares } = req.body;

    const cantidadDolares = parseFloat(dolares);
    const tipoCambio = 20.50; // Tipo de cambio fijo

    if (isNaN(cantidadDolares) || cantidadDolares < 0) {
        return res.status(400).json({ error: "Cantidad inválida" });
    }

    const pesos = cantidadDolares * tipoCambio;

    res.json({
        dolares: cantidadDolares,
        pesos: pesos,
        tipoCambio: tipoCambio
    });

});

// Endpoint para obtener el tipo de cambio
app.get('/tipo-cambio', (req, res) => {

    res.json({
        tipoCambio: 20.50,
        fecha: new Date().toLocaleString()
    });

});

app.listen(3000, () => {
    console.log('Servidor de conversor corriendo en http://localhost:3000');
});