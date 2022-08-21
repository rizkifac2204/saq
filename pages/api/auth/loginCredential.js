import db from "libs/db";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

const LoginCredential = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    res.status(401).json({ message: "Isi Semua Data" });
    return;
  }

  const checkUser = await db
    .select(`user.*`, `level.nama_level`)
    .from(`user`)
    .innerJoin(`level`, `user.level`, `level.level`)
    .where(`user.username`, username)
    .first();

  if (!checkUser) {
    res.status(401).json({ message: "Data Tidak Ditemukan" });
    return;
  }

  const match = await bcrypt.compare(password, checkUser.password);
  if (!match) return res.status(401).json({ message: "Data Tidak Ditemukan" });

  const preparejwt = {
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 hari
    id: checkUser.id,
    level: checkUser.level,
    wilayah: checkUser.wilayah,
    provinsi_id: checkUser.provinsi_id,
    kabkota_id: checkUser.kabkota_id,
    pengelola: checkUser.pengelola,
    nama: checkUser.nama,
    image: null,
  };
  const setjwt = sign(preparejwt, process.env.JWT_SECRET_KEY);

  const serialized = serialize("saqBawaslu", setjwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  res.setHeader("Set-Cookie", serialized);
  res.status(200).json({ message: "Success Login" });
};

export default LoginCredential;
