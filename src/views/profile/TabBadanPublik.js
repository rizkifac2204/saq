// ** React Imports
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import HomeWorkIcon from "@mui/icons-material/HomeWork";

const handleSubmit = (values, setProfile, setSubmitting) => {
  const toastProses = toast.loading("Tunggu Sebentar...", {
    autoClose: false,
  });
  axios
    .put(`/api/profile/badanPublik`, values)
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
      const msg = err.response.data.message
        ? err.response.data.message
        : "Gagal Proses";
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
  bp: yup.string("Masukan Nama Badan Publik").required("Harus Diisi"),
  bp_website: yup
    .string()
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      "Alamat URL Tidak Valid"
    )
    .required("Harus Diisi"),
  bp_email: yup
    .string("Masukan Email")
    .email("Email Tidak Valid")
    .required("Email Harus Diisi"),
  bp_alamat: yup.string().required("Harus Diisi"),
});

const TabBP = (props) => {
  const { profile, setProfile } = props;
  if (!profile)
    return <Skeleton variant="rectangular" width={"100%"} height={118} />;

  const formik = useFormik({
    initialValues: {
      bp: profile.bp || "",
      bp_website: profile.bp_website || "",
      bp_email: profile.bp_email || "",
      bp_fax: profile.bp_fax || "",
      bp_alamat: profile.bp_alamat || "",
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
              <HomeWorkIcon sx={{ fontSize: "2.75rem", mr: 3 }} />
              <Box>
                <Typography variant="h5">Badan Publik</Typography>
                <Typography variant="body2">Formulir Badan Publik</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Nama Badan Publik"
              name="bp"
              value={formik.values.bp}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.bp && Boolean(formik.errors.bp)}
              helperText={formik.touched.bp && formik.errors.bp}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email Badan Publik"
              type={"email"}
              required
              name="bp_email"
              value={formik.values.bp_email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.bp_email && Boolean(formik.errors.bp_email)}
              helperText={formik.touched.bp_email && formik.errors.bp_email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Alamat Website Badan Publik"
              required
              name="bp_website"
              value={formik.values.bp_website}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.bp_website && Boolean(formik.errors.bp_website)
              }
              helperText={formik.touched.bp_website && formik.errors.bp_website}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fax / Telp / HP Badan Publik"
              name="bp_fax"
              value={formik.values.bp_fax}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.bp_fax && Boolean(formik.errors.bp_fax)}
              helperText={formik.touched.bp_fax && formik.errors.bp_fax}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              label="Alamat Badan Publik"
              required
              name="bp_alamat"
              value={formik.values.bp_alamat}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.bp_alamat && Boolean(formik.errors.bp_alamat)
              }
              helperText={formik.touched.bp_alamat && formik.errors.bp_alamat}
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

export default TabBP;
