import jwt from 'jsonwebtoken';

// Middleware para autenticar usando JWT

export const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ error: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // aca se almacena los datos del usuario autenticado
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};

// verificar el rol de administrador

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado: Solo administradores' });
  }
  next();
};
