import sharp from "sharp";
import jwt from "jsonwebtoken";
import "dotenv/config.js";
import multer from "multer";

const createThumbnail = async (req, res, next) => {
  console.log("Todo: tee kuvakäsittely", req.file);
  if (!req.file) {
    next("Kuvaa ei löydy");
    return;
  }

  await sharp(req.file.path)
    .resize(100, 100)
    .toFile(`${req.file.path}_thumb.jpg`);

  next();
};

const authenticateToken = (req, res, next) => {
  console.log("authenticateToken", req.headers);
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("token", token);
  if (token == null) {
    return res.sendStatus(401);
  }
  try {
    res.locals.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(403).send({ message: "invalid token" });
  }
};

// Middleware to authorize the owner
const authorizeOwner = (getResourceOwnerId) => {
  return async (req, res, next) => {
    try {
      const resourceOwnerId = await getResourceOwnerId(req.params.id); // Get the resource owner ID
      const userId = res.locals.user.user_id; // Get the logged-in user's ID from the token

      if (resourceOwnerId !== userId) {
        return res.status(403).json({
          message: "Forbidden: You are not the owner",
        });
      }

      next(); // User is authorized, proceed to the next middleware or route handler
    } catch (error) {
      console.error("Authorization error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // Max 10 MB
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true); // Accept file
    } else {
      cb(new Error("Only images and videos are allowed"), false); // Reject file
    }
  },
});

export { authenticateToken, createThumbnail, authorizeOwner, upload };
