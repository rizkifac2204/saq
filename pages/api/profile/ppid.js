import db from "libs/db";
import Handler from "middlewares/Handler";

export default Handler().put(async (req, res) => {
  const { id } = req.session.user;
  const { ppid_nama, ppid_email, ppid_telp } = req.body;

  const cek = await db("user").where("id", id).first();
  if (!cek) return res.status(401).json({ message: "User Tidak Terdeteksi" });

  const proses = await db("user").where("id", id).update({
    ppid_nama,
    ppid_email,
    ppid_telp,
    updated_at: db.fn.now(),
  });

  // failed
  if (!proses) return res.status(400).json({ message: "Gagal Proses" });

  res.json({ message: "Berhasil Mengubah Data PPID" });
});
