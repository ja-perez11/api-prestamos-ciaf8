const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// ==========================================
// 1. CONFIGURACIÓN DE CORS (Requisito 3.2)
// ==========================================
const corsOptions = {
  origin: 'http://localhost:5500',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'X-Red-Equipo'],
  exposedHeaders: ['X-Servidor-Procesado']
};

app.use(cors(corsOptions));
app.use(express.json());

// ==========================================
// 2. MIDDLEWARE DE SEGURIDAD PERSONALIZADO (Requisito 4)
// ==========================================
const validarEquipoMiddleware = (req, res, next) => {
  const headerEquipo = req.header('X-Red-Equipo');
  const CREDENCIAL_ESPERADA = 'CIAF-8';

  // Validar que el encabezado exista y coincida exactamente con CIAF-8
  if (!headerEquipo || headerEquipo !== CREDENCIAL_ESPERADA) {
    return res.status(401).json({
      error: '401 Unauthorized',
      mensaje: 'Acceso denegado. Encabezado X-Red-Equipo faltante o incorrecto.',
      detalle: 'Se requiere la credencial exacta asignada al Equipo 8.'
    });
  }

  // Inyectar el encabezado de respuesta personalizado obligatorio
  res.setHeader('X-Servidor-Procesado', 'Equipo-8');
  next();
};

app.use('/api', validarEquipoMiddleware);

// ==========================================
// 3. DATOS INICIALES (Escenario: Solicitudes de Préstamos)
// ==========================================
let prestamos = [
  {
    id: 1,
    solicitante: 'Carlos Mendoza',
    documento: '1088234567',
    monto: 2500000,
    plazoMeses: 12,
    estado: 'Aprobado'
  },
  {
    id: 2,
    solicitante: 'Laura Gómez',
    documento: '1088987654',
    monto: 5000000,
    plazoMeses: 24,
    estado: 'En estudio'
  }
];

// ==========================================
// 4. ENDPOINTS OBLIGATORIOS (Requisito 3.1)
// ==========================================

// GET /api/recurso -> Consulta de préstamos
app.get('/api/recurso', (req, res) => {
  res.status(200).json({
    mensaje: 'Consulta de solicitudes de préstamo exitosa',
    total: prestamos.length,
    datos: prestamos
  });
});

// POST /api/recurso -> Registro de un nuevo préstamo
app.post('/api/recurso', (req, res) => {
  const { solicitante, documento, monto, plazoMeses } = req.body;

  if (!solicitante || !documento || !monto || !plazoMeses) {
    return res.status(400).json({
      error: '400 Bad Request',
      mensaje: 'Faltan campos obligatorios (solicitante, documento, monto, plazoMeses).'
    });
  }

  const nuevoPrestamo = {
    id: prestamos.length + 1,
    solicitante,
    documento,
    monto: Number(monto),
    plazoMeses: Number(plazoMeses),
    estado: 'Pendiente'
  };

  prestamos.push(nuevoPrestamo);

  res.status(201).json({
    mensaje: 'Solicitud de préstamo registrada correctamente',
    recursoCreado: nuevoPrestamo
  });
});

// ==========================================
// 5. LEVANTAR EL SERVIDOR
// ==========================================
app.listen(PORT, () => {
  console.log(`=========================================================`);
  console.log(`Servidor de Préstamos (Equipo 8) corriendo en:`);
  console.log(`http://localhost:${PORT}`);
  console.log(`CORS permitido para: http://localhost:5500`);
  console.log(`Header requerido: X-Red-Equipo: CIAF-8`);
  console.log(`=========================================================`);
});