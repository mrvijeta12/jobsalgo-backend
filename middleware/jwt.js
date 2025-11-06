import jwt from "jsonwebtoken";

//verify token
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token is missing from header." });
    }

    let token;
    if (authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    } else {
      token = authHeader;
    }
    if (!token) {
      return res.status(401).json({ message: "Token not provided." });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.loggedInUser = decode;
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

// generate token
export const generatedToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
};

export default generatedToken;
