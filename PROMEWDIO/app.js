const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/calcular-promedio', (req, res) => {

    const { nombre, unidad1, unidad2, unidad3 } = req.body;

    const u1 = parseFloat(unidad1);
    const u2 = parseFloat(unidad2);
    const u3 = parseFloat(unidad3);

    if (isNaN(u1) || isNaN(u2) || isNaN(u3)) {
        return res.status(400).json({ error: "Calificaciones inválidas" });
    }

    const promedio = (u1 + u2 + u3) / 3;
    const estatus = promedio >= 6 ? "Aprobado" : "Reprobado";

    res.json({
        nombre,
        promedio,
        estatus
    });

});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});