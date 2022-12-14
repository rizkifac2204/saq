import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionFilterKuesioner } from "middlewares/Condition";

export default Handler().get(async (req, res) => {
  const { id } = req.session.user;
  const result = await db
    .select("saq_poin.*")
    .from("saq_poin")
    .modify((builder) => conditionFilterKuesioner(builder, req.session.user));

  if (result.length !== 0) {
    for (let i = 0; i < result.length; i++) {
      const pertanyaan = await db
        .from("saq_pertanyaan")
        .count("saq_pertanyaan.id as jumlah")
        .where("poin_id", result[i].id)
        .first();

      const terjawab = await db
        .from("saq_jawaban")
        .count("saq_jawaban.id as jumlah")
        .innerJoin("saq_pertanyaan", function () {
          this.on("saq_pertanyaan.id", "=", "saq_jawaban.pertanyaan_id");
          this.andOn("saq_pertanyaan.poin_id", "=", result[i].id);
        })
        .where("saq_jawaban.user_id", id)
        .first();

      result[i].statuspertanyaan = {
        jumlahPertanyaan: pertanyaan.jumlah || 0,
        jumlahTerjawab: terjawab.jumlah || 0,
      };
    }
  }

  res.json(result);
});
