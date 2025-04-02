import sharp from "sharp";

const createThumbnail = async (req, res, next) => {
  console.log("Todo: tee kuvakäsittely", req.file);
  if (!req.file) {
    next("Kuvaa ei löydy");
    return;
  }

  await sharp(reg.file.path)
    .resize(100, 100)
    .toFile(`${req.file.path}_thumb.jpg`);

  next();
};

export default createThumbnail;
