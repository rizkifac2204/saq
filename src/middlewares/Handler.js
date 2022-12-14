import nextConnect from "next-connect";
import { verify } from "jsonwebtoken";
import cookie from "cookie";

export default function Handler() {
  return nextConnect({
    onError: (err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: err.toString(), type: "error" });
    },
    onNoMatch: (req, res) => {
      res.status(404).json({ message: "Not found", type: "error" });
    },
  }).use(async (req, res, next) => {
    try {
      const { saqBawaslu } = cookie.parse(req.headers.cookie);
      if (!saqBawaslu)
        return res.status(401).json({ message: "Akses Tidak Dikenal" });
      const decoded = verify(saqBawaslu, process.env.JWT_SECRET_KEY);
      req.session = {
        user: decoded,
      };
      next();
    } catch (err) {
      return res.status(401).json({ message: "Akses Tidak Dikenal" });
    }
  });
}
