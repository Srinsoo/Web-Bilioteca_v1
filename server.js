const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Middleware para procesar datos enviados por formularios HTML (POST)
app.use(express.urlencoded({ extended: true }));

//Ruta POST para procesar la solicitud del formulario
app.post('/solicitud', (req, res) => {
  const { id, nombre, apellido, titulo, autor, editorial, anio } = req.body;

  // Validar que todos los campos estén presentes
  if (!id || !nombre || !apellido || !titulo || !autor || !editorial || !anio) {
    return res.redirect('/error.html');
  }

  // Crear nombre de archivo y contenido
  const nombreArchivo = `id_${id}.txt`;
  const contenido = `${id},${nombre},${apellido},${titulo},${autor},${editorial},${anio}`;

  // Ruta absoluta para guardar el archivo en /data
  const rutaArchivo = path.join(__dirname, 'data', nombreArchivo);

  // Guardar archivo y luego enviarlo como descarga
  fs.writeFile(rutaArchivo, contenido, (err) => {
    if (err) {
      console.error('Error al guardar el archivo:', err);
      return res.status(500).send('Error interno del servidor');
    }

    res.download(rutaArchivo, nombreArchivo, (err) => {
      if (err) {
        console.error('Error al descargar el archivo:', err);
      }
    });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
