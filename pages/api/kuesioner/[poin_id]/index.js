import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionFilterKuesioner } from "middlewares/Condition";

export default Handler().get(async (req, res) => {
  const { id } = req.session.user;
  const { poin_id } = req.query;

  const result = await db
    .select("saq_poin.*")
    .from("saq_poin")
    .modify((builder) => conditionFilterKuesioner(builder, req.session.user))
    .where("saq_poin.id", poin_id)
    .first();
  if (!result)
    return res.status(404).json({ message: "Tidak Ditemukan", type: "error" });

  const getPertanyaan = await db
    .select(
      "saq_pertanyaan.*",
      { jawaban_id: "saq_jawaban.id" },
      "saq_jawaban.user_id",
      "saq_jawaban.jawaban",
      "saq_jawaban.keterangan",
      "saq_jawaban.url",
      "saq_jawaban.file"
    )
    .from("saq_pertanyaan")
    .leftJoin("saq_jawaban", function () {
      this.on("saq_pertanyaan.id", "=", "saq_jawaban.pertanyaan_id");
      this.andOn("saq_jawaban.user_id", "=", id);
    })
    .where("poin_id", poin_id)
    .orderBy("nomor", "asc");

  result.pertanyaan = getPertanyaan;

  res.json(result);
});
