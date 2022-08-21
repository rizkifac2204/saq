import db from "libs/db";
import { verify } from "jsonwebtoken";
import cookie from "cookie";
import { serialize } from "cookie";

const isLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res
        .setHeader(
          "Set-Cookie",
          serialize("saqBawaslu", null, {
            maxAge: -1,
            path: "/",
          })
        )
        .status(401)
        .json({ message: "Akses Tidak Dikenal" });
    }

    const decoded = verify(token, process.env.JWT_SECRET_KEY);
    const checkUser = await db
      .select(`user.*`, `level.nama_level`)
      .from(`user`)
      .innerJoin(`level`, `user.level`, `level.level`)
      .where(`id`, decoded.id)
      .first();

    if (!checkUser)
      return res
        .setHeader(
          "Set-Cookie",
          serialize("saqBawaslu", null, {
            maxAge: -1,
            path: "/",
          })
        )
        .status(401)
        .json({ message: "Akses Tidak Dikenal" });

    const preparejwt = {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 30 hari
      id: checkUser.id,
      level: checkUser.level,
      wilayah: checkUser.wilayah,
      provinsi_id: checkUser.provinsi_id,
      kabkota_id: checkUser.kabkota_id,
      pengelola: checkUser.pengelola,
      nama: checkUser.nama,
      image: null,
    };

    res.json(preparejwt);
  } catch (err) {
    res
      .setHeader(
        "Set-Cookie",
        serialize("saqBawaslu", null, {
          maxAge: -1,
          path: "/",
        })
      )
      .status(401)
      .json({ message: "Akses Tidak Dikenal" });
  }
};

export default isLogin;
