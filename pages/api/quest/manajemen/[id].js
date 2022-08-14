import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionFilterPoin } from "middlewares/Condition";

export default Handler()
  .get(async (req, res) => {
    const { id } = req.query;

    const result = await db
      .select("saq_poin.*")
      .from("saq_poin")
      .modify((builder) => conditionFilterPoin(builder, req.session.user))
      .where("saq_poin.id", id)
      .first();
    if (!result)
      return res
        .status(404)
        .json({ message: "Tidak Ditemukan", type: "error" });

    // dapatkan pertanyaan
    const getPertanyaan = await db
      .from("saq_pertanyaan")
      .select("*")
      .where("poin_id", id);
    result.pertanyaan = getPertanyaan;

    res.json(result);
  })
  .put(async (req, res) => {
    const { id } = req.query;
    const { level, wilayah } = req.session.user;

    if (level > 3)
      return res
        .status(401)
        .json({ message: "Tidak Ada Otoritas", type: "error" });

    const unit = level > 2 ? wilayah : 0;
    const { poin, penjelasan } = req.body;

    // cek data sama
    const cek = await db("saq_poin")
      .where("poin", poin)
      .andWhere("unit", unit)
      .whereNot("id", id)
      .first();
    // Jika ada yang sama
    if (cek)
      return res.status(400).json({
        message: `Poin ${poin} pada penjelasan tersebut sudah terdaftar`,
        type: "error",
      });

    const proses = await db("saq_poin").where("id", id).update({
      unit,
      poin,
      penjelasan,
    });

    // failed
    if (!proses)
      return req.status(400).json({ message: "Gagal Proses", type: "error" });

    res.json({ message: "Berhasil Mengubah Data", type: "success" });
  })
  .delete(async (req, res) => {
    const { id } = req.query;

    const proses = await db("saq_poin").where("id", id).del();

    if (!proses)
      return res.status(400).json({ message: "Gagal Hapus", type: "error" });

    res.json({ message: "Berhasil Hapus", type: "success" });
  });
