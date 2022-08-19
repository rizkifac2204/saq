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
        .where("poin_id", result[i].id)
        .orderBy("nomor", "asc");

      result[i].pertanyaan = pertanyaan;
    }
  }

  res.json(result);
});
// .post(async (req, res) => {
//   const { level, provinsi_id } = req.session.user;
//   if (level > 3)
//     return res
//       .status(401)
//       .json({ message: "Tidak Ada Otoritas", type: "error" });

//   const unit = level > 2 ? provinsi_id : 0;
//   const { poin, penjelasan } = req.body;

//   // cek data sama
//   const cek = await db("saq_poin")
//     .where({
//       poin,
//       unit,
//     })
//     .first();
//   // Jika ada yang sama
//   if (cek)
//     return res.status(400).json({
//       message: `Poin ${poin} sudah terdaftar`,
//       type: "error",
//     });

//   const proses = await db("saq_poin").insert([
//     {
//       unit,
//       poin,
//       penjelasan,
//     },
//   ]);

//   // failed
//   if (!proses)
//     return res.status(400).json({ message: "Gagal Proses", type: "error" });

//   res.json({ message: "Berhasil Menambah Poin Baru", type: "success" });
// });
