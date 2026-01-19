import jwt from "jsonwebtoken";

export function authAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "Token não enviado",
    });
  }

  const [scheme, token] = authHeader.split(" ");

  if (!/^Bearer$/i.test(scheme) || !token) {
    return res.status(401).json({
      error: "Token mal formatado",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.isAdmin) {
      return res.status(403).json({
        error: "Acesso restrito ao administrador",
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: "Token inválido ou expirado",
    });
  }
}
