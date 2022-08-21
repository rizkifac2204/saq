import { useState } from "react";
import axios from "axios";
import validator from "validator";
import { toast } from "react-toastify";
//MUI
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
// ICONS
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import LinkIcon from "@mui/icons-material/Link";

//components
import FileAction from "views/kuesioner/FileAction";

const ListPertanyaan = ({ pertanyaan }) => {
  // state
  const [data, setData] = useState(pertanyaan);
  const [statusSnack, setStatusSnack] = useState({
    open: false,
    type: "info",
    message: "",
  });
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setStatusSnack({ ...statusSnack, open: false });
  };

  const handleChange = (event) => {
    // ambil nama dan value, jika radio ganti sebagai inetegr
    const { name } = event.target;
    const value =
      event.target.type === "radio"
        ? parseInt(event.target.value)
        : event.target.value;

    // kondisi jika merubah jawaban menjadi tidak, tapi isian url dan file sudah ada
    if (name === "jawaban") {
      if (!value) {
        if (data.file || data.url) {
          const ask = confirm("Jawaban Url dan File Akan Direset. Lanjutkan?");
          if (!ask) return;
        }
      }
    }

    // lanjutkan merubah data
    setData((prev) => {
      return { ...prev, [name]: value };
    });

    // jika ini radio, langsung aksi submit
    if (name === "jawaban") handleAnswer(value, "jawaban");
  };

  const handleAnswer = (value, kolom) => {
    // cek jika url valid
    if (kolom === "url") {
      if (value && !validator.isURL(value)) {
        return setStatusSnack({
          key: new Date().getTime(),
          open: true,
          message: "Alamat Url Tidak Valid",
          type: "error",
          autoHideDuration: 6000,
        });
      }
    }

    const post = {
      [kolom]: value,
    };
    setStatusSnack({
      key: new Date().getTime(),
      open: true,
      message: "Loading",
      type: "info",
    });

    axios
      .put(
        `/api/kuesioner/${pertanyaan.poin_id}/pertanyaan/${pertanyaan.id}/`,
        post
      )
      .then((res) => {
        // tambah kan id jika insert baru
        if (res.data.id) {
          setData((prev) => {
            return { ...prev, pertanyaan_id: res.data.id };
          });
        }
        if (res.data.reset) {
          setData((prev) => {
            return { ...prev, file: null, url: null };
          });
        }
        setStatusSnack({
          ...statusSnack,
          open: true,
          message: "OK",
          type: "success",
        });
      })
      .catch((err) => {
        console.log(err.response);
        setStatusSnack({
          key: new Date().getTime(),
          open: true,
          message: err.response.data.message,
          type: "error",
        });
      });
  };

  const handleDelete = () => {
    const ask = confirm("Yakin Hapus Jawaban?");
    if (ask) {
      const toastProses = toast.loading("Tunggu Sebentar...", {
        autoClose: false,
      });
      axios
        .delete(
          `/api/kuesioner/${pertanyaan.poin_id}/pertanyaan/${pertanyaan.id}/`
        )
        .then((res) => {
          setTimeout(() => {
            setData((prev) => {
              return {
                ...prev,
                pertanyaan_id: null,
                jawaban: null,
                url: null,
                file: null,
              };
            });
          });
          toast.update(toastProses, {
            render: res.data.message,
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
        })
        .catch((err) => {
          toast.update(toastProses, {
            render: err.response.data.message,
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        });
    }
  };

  return (
    <>
      <Snackbar
        key={statusSnack ? statusSnack.key : undefined}
        open={statusSnack.open}
        autoHideDuration={3000}
        onClose={handleClose}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <Alert
          variant="filled"
          severity={statusSnack.type}
          sx={{ width: "100%" }}
        >
          {statusSnack.message}
        </Alert>
      </Snackbar>
      <ListItem>
        <Grid container spacing={2}>
          <Grid item sm={12} md={5}>
            <ListItemText
              primary={`${pertanyaan.nomor}. ${pertanyaan.pertanyaan}`}
              secondary={`— ${pertanyaan.penjelasan}`}
            />
          </Grid>
          <Grid item sm={12} md={7}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ mb: 2 }}>
                <FormControl>
                  <RadioGroup
                    name="jawaban"
                    value={data.jawaban}
                    onChange={(event) => handleChange(event)}
                  >
                    <FormControlLabel
                      value="1"
                      control={<Radio size="small" />}
                      label="Ya"
                    />
                    <FormControlLabel
                      value="0"
                      control={<Radio size="small" />}
                      label="Tidak"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <TextField
                  fullWidth
                  disabled={typeof data.jawaban === "object"}
                  label="Keterangan"
                  variant="outlined"
                  size="small"
                  multiline
                  rows={2}
                  name="keterangan"
                  value={data.keterangan ? data.keterangan : ""}
                  onChange={(event) => handleChange(event)}
                  onBlur={(event) =>
                    handleAnswer(event.target.value, "keterangan")
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  disabled={data.jawaban !== 1}
                  label="URL"
                  variant="outlined"
                  size="small"
                  name="url"
                  value={data.url ? data.url : ""}
                  onChange={(event) => handleChange(event)}
                  onBlur={(event) => handleAnswer(event.target.value, "url")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => {
                            window.open(data.url, "_blank");
                          }}
                          edge="end"
                        >
                          {data.url && <LinkIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    flexWrap: "wrap",
                  }}
                >
                  <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem />}
                    spacing={2}
                  >
                    <FileAction
                      disabled={data.jawaban !== 1}
                      data={data}
                      setData={setData}
                    />
                    <IconButton
                      aria-label="delete"
                      disabled={typeof data.jawaban === "object"}
                      onClick={handleDelete}
                    >
                      <DeleteIcon
                        color={typeof data.jawaban == "number" ? "error" : ""}
                      />
                    </IconButton>
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ListItem>
      <Divider />
    </>
  );
};

export default ListPertanyaan;
