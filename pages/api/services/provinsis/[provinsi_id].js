import db from "libs/db";
import Handler from "middlewares/Handler";

export default Handler().get(async (req, res) => {
  const { provinsi_id } = req.query;
  const data = await db("kabkota")
    .orderBy("kabkota", "asc")
    .where(true)
    .modify((builder) => {
      if (req.session.user.level === 2) {
        var array = JSON.parse("[" + req.session.user.wilayah + "]");
        builder.whereIn("provinsi_id", array);
      }
      if (req.session.user.level === 3) {
        builder.andWhere("provinsi_id", req.session.user.provinsi_id);
      }
    })
    .andWhere("provinsi_id", provinsi_id);
  res.json(data);
});
