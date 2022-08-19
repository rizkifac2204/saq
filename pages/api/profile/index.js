import db from "libs/db";
import Handler from "middlewares/Handler";
import bcrypt from "bcrypt";

export default Handler()
  .get(async (req, res) => {
    const result = await db
      .select("user.*", "level.nama_level", "provinsi.provinsi")
      .from("user")
      .innerJoin("level", "user.level", "level.level")
      .leftJoin("provinsi", "user.provinsi_id", "provinsi.id")
      .where("user.id", req.session.user.id)
      .first();

    if (!result) return res.status(404).json({ message: "Tidak Ditemukan" });

    if (result.wilayah) {
      var array = JSON.parse("[" + result.wilayah + "]");
      const getWilayah = await db
        .from("provinsi")
        .select("provinsi")
        .whereIn("id", array);

      result.daftarWilayah = getWilayah;
    }

    res.json(result);
  })
  .put(async (req, res) => {
    const { id } = req.session.user;
    const { nama, telp, email, jabatan, username, passwordConfirm } = req.body;

    const cek = await db("user").where("id", id).first();
    if (!cek) return res.status(401).json({ message: "User Tidak Terdeteksi" });

    // // jika password tidak sama
    const match = await bcrypt.compare(passwordConfirm, cek.password);

    if (!match) return res.status(401).json({ message: "Password Anda Salah" });

    //cek jika ada email yang sama
    const cekEmailSama = await db("user")
      .where("id", "!=", id)
      .andWhere("email", email)
      .first();
    if (cekEmailSama)
      return res.status(401).json({
        message:
          "Email yang anda masukan sudah di pakai user lain, silakan masukan email pengganti",
      });

    const proses = await db("user").where("id", id).update({
      nama,
      telp,
      email,
      jabatan,
      username,
      updated_at: db.fn.now(),
    });

    // failed
    if (!proses) return res.status(400).json({ message: "Gagal Proses" });

    res.json({ message: "Berhasil Mengubah Data Profile" });
  });
