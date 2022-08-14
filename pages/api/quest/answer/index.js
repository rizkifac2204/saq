import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionFilterPoin } from "middlewares/Condition";

export default Handler()
  .get(async (req, res) => {
    const result = await db
      .select("saq_poin.*")
      .from("saq_poin")
      .modify((builder) => conditionFilterPoin(builder, req.session.user))
      .orderBy("saq_poin.poin", "asc");

    if (!result)
      return res
        .status(404)
        .json({ message: "Tidak Ditemukan", type: "error" });

    res.json(result);
  })
  .post(async (req, res) => {
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
      .first();
    // Jika ada yang sama
    if (cek)
      return res.status(400).json({
        message: `Poin ${poin} sudah terdaftar`,
        type: "error",
      });

    const proses = await db("saq_poin").insert([
      {
        unit,
        poin,
        penjelasan,
      },
    ]);

    // failed
    if (!proses)
      return req.status(400).json({ message: "Gagal Proses", type: "error" });

    res.json({ message: "Berhasil Menambah Poin Baru", type: "success" });
  });
