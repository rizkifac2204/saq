import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionFilterKuesioner } from "middlewares/Condition";

export default Handler().get(async (req, res) => {
  const { poin_id } = req.query;

  const data = await db
    .select("saq_poin.*")
    .from("saq_poin")
    .modify((builder) => conditionFilterKuesioner(builder, req.session.user))
    .where("saq_poin.id", poin_id)
    .first();

  if (!data)
    return res.status(404).json({ message: "Tidak Ditemukan", type: "error" });

  const result = await db
    .select("saq_pertanyaan.*")
    .from("saq_pertanyaan")
    .where("poin_id", poin_id)
    .orderBy("saq_pertanyaan.nomor", "asc");

  res.json(result);
});
