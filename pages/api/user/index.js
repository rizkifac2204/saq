import db from "libs/db";
import Handler from "middlewares/Handler";
import bcrypt from "bcrypt";
import { conditionFilterUser } from "middlewares/Condition";

const editable = (user) => {
  if (user.level === 1) {
    return `IF(${user.level} < user.level, true, false) as editable`;
  } else if (user.level === 2) {
    return `FIND_IN_SET(user.provinsi_id, '${user.wilayah}') as editable`;
  } else if (user.level === 3) {
    return `IF(${user.level} < user.level, true, false) as editable`;
  } else {
    return `false as editable`;
  }
};
const myself = (user) => {
  return `IF(${user.id} = user.id, true, false) as myself`;
};

export default Handler()
  .get(async (req, res) => {
    const result = await db
      .select(
        "user.*",
        "level.nama_level",
        "provinsi.provinsi",
        "kabkota.kabkota",
        db.raw(myself(req.session.user)),
        db.raw(editable(req.session.user))
      )
      .from("user")
      .innerJoin("level", "user.level", "level.level")
      .leftJoin("provinsi", "user.provinsi_id", "provinsi.id")
      .leftJoin("kabkota", "user.kabkota_id", "kabkota.id")
      .modify((builder) => conditionFilterUser(builder, req.session.user))
      .orderBy("user.level", "asc");

    if (!result) return res.status(404).json({ message: "Tidak Ditemukan" });

    res.json(result);
  })
  .post(async (req, res) => {
    const { level: leveladmin } = req.session.user;
    if (leveladmin > 3)
      return res.status(401).json({ message: "Tidak Ada Otoritas" });

    const {
      level,
      provinsi_id,
      kabkota_id,
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
      password,
    } = req.body;

    // cek data login sama
    const cek = await db("user").where("username", username).first();
    // Jika ada yang sama
    if (cek)
      return res
        .status(400)
        .json({ message: "Mohon Ganti Username Pengganti", type: "error" });

    const salt = bcrypt.genSaltSync(10);
    const hashBaru = bcrypt.hashSync(password, salt);

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

    const proses = await db("user").insert([
      {
        level,
        provinsi_id: provinsi_id ? provinsi_id : null,
        kabkota_id: kabkota_id ? kabkota_id : null,
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
      },
    ]);

    // failed
    if (!proses) return res.status(400).json({ message: "Gagal Proses" });

    res.json({ message: "Berhasil Menambah User Baru" });
  })
  .delete(async (req, res) => {
    const arrID = req.body;
    const proses = await db("user").whereIn("id", arrID).del();

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Berhasil Menghapus Data Terpilih", type: "success" });
  });
