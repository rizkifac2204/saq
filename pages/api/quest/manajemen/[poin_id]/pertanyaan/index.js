import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionFilterPoin } from "middlewares/Condition";

export default Handler()
  .get(async (req, res) => {
    const { poin_id } = req.query;

    const data = await db
      .select("saq_poin.*")
      .from("saq_poin")
      .modify((builder) => conditionFilterPoin(builder, req.session.user))
      .where("saq_poin.id", poin_id)
      .first();

    if (!data)
      return res
        .status(404)
        .json({ message: "Tidak Ditemukan", type: "error" });

    const result = await db
      .select("saq_pertanyaan.*")
      .from("saq_pertanyaan")
      .where("poin_id", poin_id)
      .orderBy("saq_pertanyaan.nomor", "asc");

    res.json(result);
  })
  .post(async (req, res) => {
    const { poin_id } = req.query;
    if (!poin_id)
      return res
        .status(401)
        .json({ message: "Tidak Terdeteksi", type: "error" });
    const { level } = req.session.user;
    if (level > 3)
      return res
        .status(401)
        .json({ message: "Tidak Ada Otoritas", type: "error" });

    const { nomor, pertanyaan, penjelasan } = req.body;

    // cek data sama
    const cek = await db("saq_pertanyaan")
      .where({
        nomor,
        poin_id,
      })
      .first();
    // Jika ada yang sama
    if (cek)
      return res.status(400).json({
        message: `Pertanyaan Nomor ${nomor} sudah terdaftar`,
        type: "error",
      });

    const proses = await db("saq_pertanyaan").insert([
      {
        poin_id,
        nomor,
        pertanyaan,
        penjelasan,
      },
    ]);

    // failed
    if (!proses)
      return req.status(400).json({ message: "Gagal Proses", type: "error" });

    res.json({ message: "Berhasil Menambah Pertanyaan Baru", type: "success" });
  });
