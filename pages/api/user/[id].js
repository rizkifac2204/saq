import db from "libs/db";
import Handler from "middlewares/Handler";
import bcrypt from "bcrypt";

const editable = (user) => {
  if (user.level === 1) {
    return `true as editable`;
  } else if (user.level === 2) {
    return `FIND_IN_SET(user.provinsi_id, '${user.wilayah}') as editable`;
  } else {
    return `false as editable`;
  }
};
const myself = (user) => {
  return `IF(${user.id} = user.id, true, false) as myself`;
};

export default Handler()
  .get(async (req, res) => {
    const { id } = req.query;

    const result = await db
      .select(
        "user.*",
        "level.nama_level",
        "provinsi.provinsi",
        db.raw(myself(req.session.user)),
        db.raw(editable(req.session.user))
      )
      .from("user")
      .innerJoin("level", "user.level", "level.level")
      .leftJoin("provinsi", "user.provinsi_id", "provinsi.id")
      .where("user.id", id)
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
    const { level: leveladmin } = req.session.user;
    if (leveladmin > 2)
      return res.status(401).json({ message: "Tidak Ada Otoritas" });

    const {
      id,
      level,
      provinsi_id,
      wilayah,
      nama,
      telp,
      email,
      jabatan,
      bp,
      bp_website,
      bp_email,
      bp_fax,
      bp_alamat,
      ppid_nama,
      ppid_email,
      ppid_telp,
      username,
      passwordBaru,
    } = req.body;

    // cek data login sama
    const cek = await db("user")
      .where("username", username)
      .whereNot("id", id)
      .first();
    // Jika ada yang sama
    if (cek)
      return res
        .status(400)
        .json({ message: "Mohon Ganti Username Pengganti", type: "error" });

    const salt = bcrypt.genSaltSync(10);
    const hashBaru = bcrypt.hashSync(passwordBaru, salt);

    // persiapan value untuk kolom daftar penerima dan/atau list email
    var listwilayah = [];

    if (level === 2) {
      if (wilayah.length === 0)
        return res.status(400).json({
          message: "Pilih Daftar Provinsi Minimal 1",
        });

      // jika ada, loop provinsi dan push id ke listwilayah
      const getIDProvinsi = await db("provinsi")
        .select("id")
        .whereIn("provinsi", wilayah);

      getIDProvinsi.map((item) => {
        listwilayah.push(item.id);
      });
    }

    const proses = await db("user")
      .where("id", id)
      .update({
        level,
        provinsi_id: provinsi_id ? provinsi_id : null,
        wilayah: listwilayah.length === 0 ? null : `${listwilayah}`,
        nama,
        telp,
        email,
        jabatan,
        bp,
        bp_website,
        bp_email,
        bp_fax,
        bp_alamat,
        ppid_nama,
        ppid_email,
        ppid_telp,
        username,
        password: hashBaru,
      });

    // failed
    if (!proses) return req.status(400).json({ message: "Gagal Proses" });

    res.json({ message: "Berhasil Mengubah Data User" });
  })
  .delete(async (req, res) => {
    const { id } = req.query;
    const proses = await db("user").where("id", id).del();

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Berhasil Hapus", type: "success" });
  });
