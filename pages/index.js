// ** React Imports
import { useState } from "react";

import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";

// ** Next Imports
import { useRouter } from "next/router";
import Image from "next/image";

// ** MUI Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import InputAdornment from "@mui/material/InputAdornment";
import MuiFormControlLabel from "@mui/material/FormControlLabel";

// ** Icons Imports
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";

// ** Configs
import themeConfig from "src/configs/themeConfig";

// ** Layout Import
import BlankLayout from "src/@core/layouts/BlankLayout";
import { FlaskEmpty } from "mdi-material-ui";

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { width: "28rem" },
}));

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  "& .MuiFormControlLabel-label": {
    fontSize: "0.875rem",
    color: theme.palette.text.secondary,
  },
}));

const validationSchema = yup.object({
  username: yup.string("Masukan Username").required("Harus Diisi"),
  password: yup.string("Masukan password").required("Password Harus Diisi"),
});

const LoginPage = () => {
  // ** State
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (values, setSubmitting) => {
    const toastProses = toast.loading("Tunggu Sebentar...", {
      autoClose: false,
    });
    axios
      .post(`/api/auth/loginCredential`, values)
      .then((res) => {
        // console.log(res);
        toast.update(toastProses, {
          render: `${res.data.message}, Mengalihkan Halaman`,
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        window.open("/admin", "_self");
      })
      .catch((err) => {
        console.log(err.response);
        const msg = err.response.data.message
          ? err.response.data.message
          : "Terjadi Kesalahan";
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

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) =>
      handleSubmit(values, setSubmitting),
  });

  return (
    <Box className="content-center">
      <Card sx={{ zIndex: 1 }}>
        <CardContent
          sx={{ padding: (theme) => `${theme.spacing(12, 9, 7)} !important` }}
        >
          <Box
            sx={{
              mb: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image alt="" src="/logo.png" width={30} height={25} />
            <Typography
              variant="h6"
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: "uppercase",
                fontSize: "1.5rem !important",
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, marginBottom: 1.5 }}
            >
              Selamat Datang di {themeConfig.templateName}!
            </Typography>
            <Typography variant="body2">
              Silakan Masukan Username dan Password Anda
            </Typography>
          </Box>
          <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
            <TextField
              autoFocus
              fullWidth
              name="username"
              id="username"
              label="Username"
              sx={{ marginBottom: 4 }}
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
            <FormControl fullWidth>
              <InputLabel htmlFor="auth-login-password">Password</InputLabel>
              <OutlinedInput
                label="Password"
                name="password"
                value={formik.values.password}
                id="auth-login-password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type={showPassword ? "text" : "password"}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Box
              sx={{
                mb: 4,
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <FormControlLabel control={<Checkbox />} label="Remember Me" />
            </Box>
            <Button
              fullWidth
              size="large"
              variant="contained"
              sx={{ marginBottom: 7 }}
              type="submit"
              disabled={formik.isSubmitting}
            >
              Login
            </Button>
            <Divider sx={{ my: 5 }}>Bawaslu Republik Indonesia</Divider>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
LoginPage.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;

export default LoginPage;
