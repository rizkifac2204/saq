import db from "libs/db";
import Handler from "middlewares/Handler";
import {
  conditionFilterKuesioner,
  conditionFilterPoin,
} from "middlewares/Condition";

export default Handler().get(async (req, res) => {
  const { id } = req.query;
  const result = await db
    .select("saq_poin.*")
    .from("saq_poin")
    .modify((builder) => conditionFilterPoin(builder, req.session.user));

  if (result.length !== 0) {
    for (let i = 0; i < result.length; i++) {
      const pertanyaan = await db
        .select(
          "saq_pertanyaan.*",
          { jawaban_id: "saq_jawaban.id" },
          "saq_jawaban.user_id",
          "saq_jawaban.jawaban",
          "saq_jawaban.keterangan",
          "saq_jawaban.url",
          "saq_jawaban.file",
          "saq_jawaban.nilai"
        )
        .from("saq_pertanyaan")
        .leftJoin("saq_jawaban", function () {
          this.on("saq_pertanyaan.id", "=", "saq_jawaban.pertanyaan_id");
          this.andOn("saq_jawaban.user_id", Number(id));
        })
        .where("saq_pertanyaan.poin_id", result[i].id)
        .orderBy("saq_pertanyaan.nomor", "asc");

      result[i].pertanyaan = pertanyaan;
    }
  }

  res.json(result);
});
