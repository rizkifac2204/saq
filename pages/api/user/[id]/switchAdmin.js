import db from "libs/db";
import Handler from "middlewares/Handler";
import bcrypt from "bcrypt";
import { conditionFilterUser } from "middlewares/Condition";
import { DeleteUpload } from "middlewares/UploadServices";

export default Handler().put(async (req, res) => {
  const { level: leveladmin } = req.session.user;
  if (leveladmin > 3)
    return res.status(401).json({ message: "Tidak Ada Otoritas" });

  const { id } = req.query;
  var value = null;

  // cek data
  const cek = await db("user")
    .select("pengelola", "level")
    .where("id", id)
    .first();

  if (cek.level !== 3)
    return res.status(400).json({ message: "Hanya Boleh User Provinsi" });

  if (cek.pengelola) {
    value = null;
  } else {
    value = 1;
  }

  const proses = await db("user").where("id", id).update({
    pengelola: value,
  });

  // failed
  if (!proses) return res.status(400).json({ message: "Gagal Proses" });

  res.json({ message: "Berhasil Memproses Data", value: value });
});
