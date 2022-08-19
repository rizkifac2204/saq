import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionFilterPoin } from "middlewares/Condition";

export default Handler()
  .get(async (req, res) => {
    const { poin_id } = req.query;

    const result = await db
      .select("saq_poin.*")
      .from("saq_poin")
      .modify((builder) => conditionFilterPoin(builder, req.session.user))
      .where("saq_poin.id", poin_id)
      .first();
    if (!result)
      return res
        .status(404)
        .json({ message: "Tidak Ditemukan", type: "error" });

    // dapatkan pertanyaan
    const getPertanyaan = await db
      .from("saq_pertanyaan")
      .select("*")
      .where("poin_id", poin_id);
    result.pertanyaan = getPertanyaan;

    res.json(result);
  })
  .put(async (req, res) => {
    const { poin_id } = req.query;
    const { level, provinsi_id } = req.session.user;

    if (level > 3)
      return res
        .status(401)
        .json({ message: "Tidak Ada Otoritas", type: "error" });

    const unit = level > 2 ? provinsi_id : 0;
    const { poin, penjelasan } = req.body;

    // cek data sama
    const cek = await db("saq_poin")
      .where({
        poin,
        unit,
      })
      .whereNot("id", poin_id)
      .first();
    // Jika ada yang sama
    if (cek)
      return res.status(400).json({
        message: `Poin ${poin} sudah terdaftar`,
        type: "error",
      });

    const proses = await db("saq_poin").where("id", poin_id).update({
      unit,
      poin,
      penjelasan,
    });

    // failed
    if (!proses)
      return res.status(400).json({ message: "Gagal Proses", type: "error" });

    res.json({ message: "Berhasil Mengubah Data", type: "success" });
  })
  .delete(async (req, res) => {
    const { poin_id } = req.query;

    const proses = await db("saq_poin").where("id", poin_id).del();

    if (!proses)
      return res.status(400).json({ message: "Gagal Hapus", type: "error" });

    res.json({ message: "Berhasil Hapus", type: "success" });
  });
