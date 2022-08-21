// export const labelTingkat = (level) => {
//   if (level === 1) return "Se-Nasional";
//   if (level === 2) return "Se-Provinsi";
//   if (level === 3) return "Se-Kabupaten/Kota";
//   return null;
// };

// export const conditionWillSpesific = (db, builder, user, table) => {
//   if (user.level === 1) {
//     // skip untuk semua
//   }
//   if (user.level === 2) {
//     builder.where(`${table}.bawaslu_id`, "like", `${user.bawaslu_id}%`);
//   }
//   if (user.level === 3) {
//     builder.where(`${table}.bawaslu_id`, "=", user.bawaslu_id);
//   }
// };

// export const buatTiketByAdmin = (length, level, bawaslu_id) => {
//   var firstCode = "";
//   var result = "";
//   var characters = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//   var charactersLength = characters.length;
//   for (var i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//   }
//   if (level !== 1) {
//     firstCode = bawaslu_id;
//   } else {
//     firstCode = "01";
//   }
//   return firstCode + "-" + result;
// };

export const conditionFilterPoin = (builder, user) => {
  if (user.level < 3) {
    builder.where("saq_poin.unit", `0`);
  }
  if (user.level === 3) {
    builder.where("saq_poin.unit", user.provinsi_id);
  }
  if (user.level === 4) {
    builder.where(false);
  }
};

export const conditionFilterUser = (builder, user) => {
  if (user.level < 3) {
    builder.whereNot("user.level", 4);
  }
  if (user.level === 3) {
    builder.where("user.provinsi_id", user.provinsi_id);
  }
  if (user.level === 4) {
    builder.where("user.kabkota_id", user.kabkota_id);
  }
};

export const conditionFilterKuesioner = (builder, user) => {
  if (user.level < 3) {
    builder.where(false);
  }
  if (user.level === 3) {
    builder.where("saq_poin.unit", `0`);
  }
  if (user.level === 4) {
    builder.where("saq_poin.unit", user.provinsi_id);
  }
};
