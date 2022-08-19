import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionFilterKuesioner } from "middlewares/Condition";

export default Handler()
  .get(async (req, res) => {
    const { poin_id, pertanyaan_id } = req.query;
    const { id: user_id } = req.session.user;

    const data = await db
      .select("saq_poin.*")
      .from("saq_poin")
      .modify((builder) => conditionFilterKuesioner(builder, req.session.user))
      .where("saq_poin.id", poin_id)
      .first();

    if (!data)
      return res
        .status(404)
        .json({ message: "Tidak Ditemukan", type: "error" });

    const result = await db
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
        this.andOn("saq_jawaban.user_id", "=", user_id);
      })
      .where("saq_pertanyaan.poin_id", poin_id)
      .andWhere("saq_pertanyaan.id", pertanyaan_id)
      .first();

    if (!result)
      return res
        .status(404)
        .json({ message: "Tidak Ditemukan", type: "error" });

    res.json(result);
  })
  .put(async (req, res) => {
    const { id: user_id } = req.session.user;
    const { poin_id, pertanyaan_id } = req.query;
    if (!poin_id && !pertanyaan_id)
      return res
        .status(401)
        .json({ message: "Tidak Terdeteksi", type: "error" });

    // cek insert atau update
    const cek = await db("saq_jawaban")
      .where({
        user_id,
        pertanyaan_id,
      })
      .first();

    if (cek) {
      // update
      const proses = await db("saq_jawaban")
        .where({
          user_id,
          pertanyaan_id,
        })
        .update(req.body);

      // failed
      if (!proses)
        return res
          .status(400)
          .json({ message: "Gagal Update Jawaban", type: "error" });
    } else {
      // insert
      req.body.user_id = user_id;
      req.body.pertanyaan_id = pertanyaan_id;
      const proses = await db("saq_jawaban").insert([req.body]);

      // failed
      if (!proses)
        return res
          .status(400)
          .json({ message: "Gagal Menginput Jawaban", type: "error" });
    }

    res.json({ message: "Berhasil Memproses Jawaban", type: "success" });
  });
// .delete(async (req, res) => {
//   const { poin_id, pertanyaan_id } = req.query;

//   const proses = await db("saq_pertanyaan").where("id", pertanyaan_id).del();

//   if (!proses)
//     return res.status(400).json({ message: "Gagal Hapus", type: "error" });

//   res.json({ message: "Berhasil Hapus", type: "success" });
// });
