import db from "libs/db";
import Handler from "middlewares/Handler";

export default Handler().put(async (req, res) => {
  const { id } = req.session.user;
  const { bp, bp_website, bp_email, bp_fax, bp_alamat } = req.body;

  const cek = await db("user").where("id", id).first();
  if (!cek) return res.status(401).json({ message: "User Tidak Terdeteksi" });

  const proses = await db("user").where("id", id).update({
    bp,
    bp_website,
    bp_email,
    bp_fax,
    bp_alamat,
    updated_at: db.fn.now(),
  });

  // failed
  if (!proses) return req.status(400).json({ message: "Gagal Proses" });

  res.json({ message: "Berhasil Mengubah Data Badan Publik" });
});
