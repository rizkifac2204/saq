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
import ApartmentIcon from "@mui/icons-material/Apartment";

const handleSubmit = (values, setProfile, setSubmitting) => {
  const toastProses = toast.loading("Tunggu Sebentar...", {
    autoClose: false,
  });
  axios
    .put(`/api/profile/ppid`, values)
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
  ppid_nama: yup.string("Masukan Nama PPID").required("Harus Diisi"),
  ppid_email: yup
    .string("Masukan Email")
    .email("Email Tidak Valid")
    .required("Email Harus Diisi"),
  ppid_telp: yup.string().required("Harus Diisi"),
});

const TabPPID = (props) => {
  const { profile, setProfile } = props;
  if (!profile)
    return <Skeleton variant="rectangular" width={"100%"} height={118} />;

  const formik = useFormik({
    initialValues: {
      ppid_nama: profile.ppid_nama || "",
      ppid_email: profile.ppid_email || "",
      ppid_telp: profile.ppid_telp || "",
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
              <ApartmentIcon sx={{ fontSize: "2.75rem", mr: 3 }} />
              <Box>
                <Typography variant="h5">PPID</Typography>
                <Typography variant="body2">Formulir PPID</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Nama PPID"
              name="ppid_nama"
              value={formik.values.ppid_nama}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.ppid_nama && Boolean(formik.errors.ppid_nama)
              }
              helperText={formik.touched.ppid_nama && formik.errors.ppid_nama}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email PPID"
              type={"email"}
              required
              name="ppid_email"
              value={formik.values.ppid_email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.ppid_email && Boolean(formik.errors.ppid_email)
              }
              helperText={formik.touched.ppid_email && formik.errors.ppid_email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Telp PPID"
              required
              name="ppid_telp"
              value={formik.values.ppid_telp}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.ppid_telp && Boolean(formik.errors.ppid_telp)
              }
              helperText={formik.touched.ppid_telp && formik.errors.ppid_telp}
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

export default TabPPID;
