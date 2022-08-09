// ** React Imports
import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";

const ImgStyled = styled("img")(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius,
}));

const handleSubmit = (values, setProfile, setSubmitting) => {
  const toastProses = toast.loading("Tunggu Sebentar...", {
    autoClose: false,
  });
  axios
    .put(`/api/profile`, values)
    .then((res) => {
      setProfile((prev) => {
        return { ...prev, ...values };
      });
      toast.update(toastProses, {
        render: res.data.message,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    })
    .catch((err) => {
      console.log(err.response.data);
      let tempMassage = "Gagal Proses";
      if (err.response.status == 404) {
        tempMassage =
          "Mohon Maaf, Hilangkan atau ganti spesial karakter pada inputan anda";
      }
      const msg = err.response.data.message
        ? err.response.data.message
        : tempMassage;
      toast.update(toastProses, {
        render: msg,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    })
    .then(() => {
      setSubmitting(false);
    });
};

const validationSchema = yup.object({
  nama: yup.string("Masukan Nama").required("Harus Diisi"),
  telp: yup.string("Masukan Telp/HP").required("Telp Harus Diisi"),
  email: yup
    .string("Masukan Email")
    .email("Email Tidak Valid")
    .required("Email Harus Diisi"),
  jabatan: yup.string().required("Jabatan Harus Diisi"),
  username: yup.string().required("Username Harus Diisi"),
  passwordConfirm: yup.string().required("Password Harus Diisi"),
});

const TabAccount = (props) => {
  const { profile, setProfile } = props;
  if (!profile)
    return <Skeleton variant="rectangular" width={"100%"} height={118} />;
  // ** State
  const [imgSrc, setImgSrc] = useState("/avatar.jpg");
  const onChange = (file) => {
    const reader = new FileReader();
    const { files } = file.target;
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result);
      reader.readAsDataURL(files[0]);
    }
  };

  const formik = useFormik({
    initialValues: {
      nama: profile.nama || "",
      telp: profile.telp || "",
      email: profile.email || "",
      jabatan: profile.jabatan || "",
      username: profile.username || "",
      passwordConfirm: "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) =>
      handleSubmit(values, setProfile, setSubmitting),
  });

  return (
    <CardContent>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={7}>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ImgStyled src={imgSrc} alt="Profile Pic" />
              <Box>
                <Typography variant="h5">{profile.nama}</Typography>
                <Typography variant="body2">{profile.nama_level}</Typography>
                {profile.daftarWilayah ? (
                  <>
                    <Typography variant="caption" color="secondary">
                      <div>
                        {profile.daftarWilayah
                          .map((t, idx) => <span key={idx}>{t.provinsi}</span>)
                          .reduce((prev, curr) => [prev, ", ", curr])}
                      </div>
                    </Typography>
                  </>
                ) : (
                  <></>
                )}
                {profile.provinsi && (
                  <>
                    <Typography variant="caption" color="secondary">
                      {profile.provinsi}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          </Grid>

          {/* disable  */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              disabled
              label="Role"
              value={profile.nama_level ? profile.nama_level : ""}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Nama"
              name="nama"
              value={formik.values.nama}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nama && Boolean(formik.errors.nama)}
              helperText={formik.touched.nama && formik.errors.nama}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type={"email"}
              required
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Telp/Hp"
              required
              name="telp"
              value={formik.values.telp}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.telp && Boolean(formik.errors.telp)}
              helperText={formik.touched.telp && formik.errors.telp}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Jabatan"
              required
              name="jabatan"
              value={formik.values.jabatan}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.jabatan && Boolean(formik.errors.jabatan)}
              helperText={formik.touched.jabatan && formik.errors.jabatan}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Username"
              required
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Password Lama"
              required
              type={"password"}
              name="passwordConfirm"
              value={formik.values.passwordConfirm}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.passwordConfirm &&
                Boolean(formik.errors.passwordConfirm)
              }
              helperText={
                formik.touched.passwordConfirm && formik.errors.passwordConfirm
              }
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              disabled={formik.isSubmitting}
              type={"submit"}
              variant="contained"
              sx={{ marginRight: 3.5 }}
            >
              Simpan Perubahan
            </Button>
            <Button
              type="reset"
              onClick={() => formik.resetForm()}
              variant="outlined"
              color="secondary"
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  );
};

export default TabAccount;
