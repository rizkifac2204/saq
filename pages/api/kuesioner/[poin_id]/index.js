import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionFilterKuesioner } from "middlewares/Condition";

export default Handler().get(async (req, res) => {
  const { poin_id } = req.query;

  const result = await db
    .select("saq_poin.*")
    .from("saq_poin")
    .modify((builder) => conditionFilterKuesioner(builder, req.session.user))
    .where("saq_poin.id", poin_id)
    .first();
  if (!result)
    return res.status(404).json({ message: "Tidak Ditemukan", type: "error" });

  // dapatkan pertanyaan
  const getPertanyaan = await db
    .from("saq_pertanyaan")
    .select("*")
    .where("poin_id", poin_id);
  result.pertanyaan = getPertanyaan;

  res.json(result);
});
