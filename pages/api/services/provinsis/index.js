import db from "libs/db";
import Handler from "middlewares/Handler";

export default Handler().get(async (req, res) => {
  const data = await db("provinsi")
    .orderBy("provinsi", "asc")
    .modify((builder) => {
      if (req.session.user.level === 2) {
        var array = JSON.parse("[" + req.session.user.wilayah + "]");
        builder.whereIn("id", array);
      }
      if (req.session.user.level === 3) {
        builder.where("id", req.session.user.provinsi_id);
      }
    });
  res.json(data);
});
