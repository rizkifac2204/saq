import PublicHandler from "middlewares/PublicHandler";
const path = require("path");
const fs = require("fs");
var mime = require("mime-types");

const notAllowed = [
  "application/javascript",
  "text/html",
  "application/x-httpd-php",
];

export default PublicHandler().get(async (req, res) => {
  const _path = req.query.slug.join("/");
  if (!_path)
    return res.status(404).json({
      message: "File tidak terdeteksi",
      type: "error",
    });
  const filePath = path.resolve("./", _path);
  try {
    if (fs.existsSync(filePath)) {
      if (notAllowed.includes(mime.lookup(filePath)))
        return res.status(404).json({
          message: "Tidak Didukung",
          type: "error",
        });

      fs.readFile(filePath, function (err, data) {
        res.writeHead(200, { "Content-Type": mime.lookup(filePath) });
        res.write(data);
        return res.end();
      });
    } else {
      return res.status(404).json({
        message: "File tidak ditemukan",
        type: "error",
      });
    }
  } catch (err) {
    return res.status(400).json({
      message: "File error",
      type: "error",
    });
  }
  // res.json({ data: "apa" });
});
