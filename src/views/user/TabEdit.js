// ** React Imports
import { useState, useEffect, useContext } from "react";
import AuthContext from "context/AuthContext";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import FormHelperText from "@mui/material/FormHelperText";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

// ** Icons Imports
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";

const klasifikasilevel = (level) => {
  if (!level) return;
  if (level === 1) {
    const level = [
      { level: 2, nama_level: "Admin" },
      { level: 3, nama_level: "User Provinsi" },
    ];
    return level.map((item) => (
      <MenuItem key={item.level} value={item.level}>
        {item.nama_level}
      </MenuItem>
    ));
  }
  if (level === 2) {
    const level = [{ level: 3, nama_level: "User Provinsi" }];
    return level.map((item) => (
      <MenuItem key={item.level} value={item.level}>
        {item.nama_level}
      </MenuItem>
    ));
  }
  if (level === 3) {
    const level = [{ level: 4, nama_level: "User Kabupaten/Kota" }];
    return level.map((item) => (
      <MenuItem key={item.level} value={item.level}>
        {item.nama_level}
      </MenuItem>
    ));
  }
};

const handleSubmit = (values, setDetail, setSubmitting) => {
  const toastProses = toast.loading("Tunggu Sebentar...", {
    autoClose: false,
  });
  axios
    .put(`/api/user/${values.id}`, values)
    .then((res) => {
      console.log(res.data);
      setDetail({ ...values });
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
        tempMassage = "Terjadi Kesalahan";
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
  // required
  nama: yup.string("Masukan Nama").required("Harus Diisi"),
  wilayah: yup
    .array()
    .nullable(true)
    .when("level", {
      is: (level) => level == 2,
      then: yup.array().min(1, "Pilih Provinsi"),
      otherwise: yup.array(),
    }),
  provinsi_id: yup
    .string()
    .nullable(true)
    .when("level", {
      is: (level) => level == 3,
      then: yup.string().required("Harus Dipilih"),
    }),
  kabkota_id: yup
    .string()
    .nullable(true)
    .when("level", {
      is: (level) => level == 4,
      then: yup.string().required("Harus Dipilih"),
    }),
  username: yup.string().required("Username Harus Diisi"),
  passwordBaru: yup.string().required("Password Harus Diisi"),
  passwordConfirm: yup
    .string()
    .required("Konfirmasi Password Harus Diisi")
    .oneOf([yup.ref("passwordBaru"), null], "Passwords Tidak Sama"),

  // tidak harus tapi tetap di validasi
  email: yup.string("Masukan Email").email("Email Tidak Valid"),
  bp_website: yup
    .string()
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      "Alamat URL Tidak Valid"
    ),
  bp_email: yup.string("Masukan Email").email("Email Tidak Valid"),
  ppid_email: yup.string("Masukan Email").email("Email Tidak Valid"),
});

const TabEdit = (props) => {
  const { detail, setDetail } = props;
  if (!detail)
    return <Skeleton variant="rectangular" width={"100%"} height={118} />;

  const [show, setShow] = useState({
    showNewPassword: false,
    showCurrentPassword: false,
    showConfirmNewPassword: false,
  });

  const handleClickShowNewPassword = () => {
    setShow({ ...show, showNewPassword: !show.showNewPassword });
  };

  const handleClickShowConfirmNewPassword = () => {
    setShow({
      ...show,
      showConfirmNewPassword: !show.showConfirmNewPassword,
    });
  };

  const [provinsis, setProvinsis] = useState([]);
  const [kabkotas, setKabkotas] = useState([]);
  // panggil provinsi terlebih dahulu
  useEffect(() => {
    const fetchProv = () => {
      axios
        .get(`/api/services/provinsis`)
        .then((res) => {
          setProvinsis(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchProv();
  }, []);

  const formik = useFormik({
    initialValues: {
      ...detail,
      wilayah: detail.daftarWilayah
        ? detail.daftarWilayah.map((a) => a.provinsi)
        : [],
      passwordBaru: "",
      passwordConfirm: "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) =>
      handleSubmit(values, setDetail, setSubmitting),
  });

  useEffect(() => {
    if (!formik.values.provinsi_id) return;
    if (!formik.values.level) return;
    const fetchKabkota = () => {
      axios
        .get(`/api/services/provinsis/${formik.values.provinsi_id}`)
        .then((res) => {
          setKabkotas(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (formik.values.level === 4) fetchKabkota();
  }, [formik.values.provinsi_id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card>
      <CardContent>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={7}>
            <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AccountCircleIcon sx={{ fontSize: "2.75rem", mr: 3 }} />
                <Box>
                  <Typography variant="h5">Edit User</Typography>
                  <Typography variant="body2">
                    Formulir Edit User <small>{`( * Wajib Isi )`}</small>
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* level  */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Role"
                name="nama_level"
                disabled
                value={formik.values.nama_level}
              />
            </Grid>
            {/* prov  */}
            {formik.values.level === 3 && provinsis.length > 0 && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Provinsi *</InputLabel>
                  <Select
                    label="Provinsi *"
                    required
                    name="provinsi_id"
                    value={formik.values.provinsi_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.provinsi_id &&
                      Boolean(formik.errors.provinsi_id)
                    }
                  >
                    <MenuItem value="">--Pilih Provinsi</MenuItem>
                    {provinsis.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.provinsi}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            {/* kabupaten/kota  */}
            {formik.values.level === 4 && kabkotas.length > 0 && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Kabupaten/Kota *</InputLabel>
                  <Select
                    label="Kabupaten/Kota *"
                    required
                    name="kabkota_id"
                    value={formik.values.kabkota_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.kabkota_id &&
                      Boolean(formik.errors.kabkota_id)
                    }
                  >
                    <MenuItem value="">--Pilih Kabupaten/Kota</MenuItem>
                    {kabkotas.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.kabkota}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            {/* admin  */}
            {formik.values.level === 2 && (
              <Grid item xs={12} sm={12}>
                <FormControl
                  fullWidth
                  sx={{ mt: 2 }}
                  error={
                    formik.touched.wilayah && Boolean(formik.errors.wilayah)
                  }
                >
                  <InputLabel id="demo-multiple-chip-label">
                    Pilih Provinsi
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    required
                    name="wilayah"
                    label="Pilih Provinsi *"
                    value={formik.values.wilayah}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 48 * 4.5 + 8,
                          width: 250,
                        },
                      },
                    }}
                  >
                    {provinsis.map((item) => (
                      <MenuItem key={item.id} value={item.provinsi}>
                        <Checkbox
                          checked={
                            formik.values.wilayah.indexOf(item.provinsi) > -1
                          }
                        />
                        <ListItemText primary={item.provinsi} />
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {formik.touched.wilayah && formik.errors.wilayah}
                  </FormHelperText>
                </FormControl>
              </Grid>
            )}
            {/* nama  */}
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
            {/* email  */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type={"email"}
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            {/* telp  */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telp/Hp"
                name="telp"
                value={formik.values.telp}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.telp && Boolean(formik.errors.telp)}
                helperText={formik.touched.telp && formik.errors.telp}
              />
            </Grid>
            {/* jabatan  */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Jabatan"
                name="jabatan"
                value={formik.values.jabatan}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.jabatan && Boolean(formik.errors.jabatan)}
                helperText={formik.touched.jabatan && formik.errors.jabatan}
              />
            </Grid>
            {/* khusus jika user provinsi #Badanpublik */}
            {formik.values.level === 3 && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
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
                    name="bp_email"
                    value={formik.values.bp_email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.bp_email && Boolean(formik.errors.bp_email)
                    }
                    helperText={
                      formik.touched.bp_email && formik.errors.bp_email
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Alamat Website Badan Publik"
                    name="bp_website"
                    value={formik.values.bp_website}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.bp_website &&
                      Boolean(formik.errors.bp_website)
                    }
                    helperText={
                      formik.touched.bp_website && formik.errors.bp_website
                    }
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
                    error={
                      formik.touched.bp_fax && Boolean(formik.errors.bp_fax)
                    }
                    helperText={formik.touched.bp_fax && formik.errors.bp_fax}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Alamat Badan Publik"
                    name="bp_alamat"
                    value={formik.values.bp_alamat}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.bp_alamat &&
                      Boolean(formik.errors.bp_alamat)
                    }
                    helperText={
                      formik.touched.bp_alamat && formik.errors.bp_alamat
                    }
                  />
                </Grid>
              </>
            )}
            {/* khusus jika user provinsi #PPID */}
            {formik.values.level === 3 && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nama PPID"
                    name="ppid_nama"
                    value={formik.values.ppid_nama}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.ppid_nama &&
                      Boolean(formik.errors.ppid_nama)
                    }
                    helperText={
                      formik.touched.ppid_nama && formik.errors.ppid_nama
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email PPID"
                    type={"email"}
                    name="ppid_email"
                    value={formik.values.ppid_email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.ppid_email &&
                      Boolean(formik.errors.ppid_email)
                    }
                    helperText={
                      formik.touched.ppid_email && formik.errors.ppid_email
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Telp PPID"
                    name="ppid_telp"
                    value={formik.values.ppid_telp}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.ppid_telp &&
                      Boolean(formik.errors.ppid_telp)
                    }
                    helperText={
                      formik.touched.ppid_telp && formik.errors.ppid_telp
                    }
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Grid container spacing={7}>
                {/* username  */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    required
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.username && Boolean(formik.errors.username)
                    }
                    helperText={
                      formik.touched.username && formik.errors.username
                    }
                  />
                </Grid>
                {/* password  */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="account-settings-new-password">
                      New Password *
                    </InputLabel>
                    <OutlinedInput
                      label="New Password"
                      required
                      id="account-settings-new-password"
                      type={show.showNewPassword ? "text" : "password"}
                      name="passwordBaru"
                      value={formik.values.passwordBaru}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.passwordBaru &&
                        Boolean(formik.errors.passwordBaru)
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={handleClickShowNewPassword}
                            aria-label="toggle password visibility"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            {show.showNewPassword ? (
                              <EyeOutline />
                            ) : (
                              <EyeOffOutline />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="account-settings-confirm-new-password">
                      Confirm New Password *
                    </InputLabel>
                    <OutlinedInput
                      label="Confirm New Password"
                      required
                      id="account-settings-confirm-new-password"
                      type={show.showConfirmNewPassword ? "text" : "password"}
                      name="passwordConfirm"
                      value={formik.values.passwordConfirm}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.passwordConfirm &&
                        Boolean(formik.errors.passwordConfirm)
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmNewPassword}
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            {show.showConfirmNewPassword ? (
                              <EyeOutline />
                            ) : (
                              <EyeOffOutline />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
                {/* konfirmasi  */}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button
                disabled={formik.isSubmitting}
                type={"submit"}
                variant="contained"
                sx={{ marginRight: 3.5 }}
              >
                Update User
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
    </Card>
  );
};

export default TabEdit;
