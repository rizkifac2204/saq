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

const ListPertanyaan = (props) => {
  const { data, setData, curPoin } = props;
  // state
  const [pertanyaan, setPertanyaan] = useState(props.pertanyaan);
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
        if (pertanyaan.file || pertanyaan.url) {
          const ask = confirm("Jawaban Url dan File Akan Direset. Lanjutkan?");
          if (!ask) return;
        }
      }
    }

    // lanjutkan merubah data
    setPertanyaan((prev) => {
      return { ...prev, [name]: value };
    });

    // jika ini radio, langsung aksi submit
    if (name === "jawaban") handleAnswer(value, "jawaban");
  };

  const changeChip = (operator) => {
    const newData = data.map((item) => {
      if (item.id === curPoin.id) {
        return {
          ...item,
          statuspertanyaan: {
            ...item.statuspertanyaan,
            jumlahTerjawab: operator
              ? Number(item.statuspertanyaan.jumlahTerjawab) + 1
              : Number(item.statuspertanyaan.jumlahTerjawab) - 1,
          },
        };
      }
      return item;
    });
    setData(newData);
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
        if (res.data.id) changeChip(true);
        setPertanyaan((prev) => {
          const old = { ...prev };
          if (res.data.id) old.jawaban_id = res.data.id;
          if (res.data.reset) {
            old.file = null;
            old.url = null;
          }
          return old;
        });

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
          changeChip(false);
          setPertanyaan((prev) => {
            return {
              ...prev,
              jawaban_id: null,
              jawaban: null,
              url: null,
              file: null,
            };
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
                    value={pertanyaan.jawaban}
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
                  disabled={typeof pertanyaan.jawaban === "object"}
                  label="Keterangan"
                  variant="outlined"
                  size="small"
                  multiline
                  rows={2}
                  name="keterangan"
                  value={pertanyaan.keterangan ? pertanyaan.keterangan : ""}
                  onChange={(event) => handleChange(event)}
                  onBlur={(event) =>
                    handleAnswer(event.target.value, "keterangan")
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  disabled={pertanyaan.jawaban !== 1}
                  label="URL"
                  variant="outlined"
                  size="small"
                  name="url"
                  value={pertanyaan.url ? pertanyaan.url : ""}
                  onChange={(event) => handleChange(event)}
                  onBlur={(event) => handleAnswer(event.target.value, "url")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => {
                            window.open(pertanyaan.url, "_blank");
                          }}
                          edge="end"
                        >
                          {pertanyaan.url && <LinkIcon />}
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
                      disabled={pertanyaan.jawaban !== 1}
                      data={pertanyaan}
                      setData={setPertanyaan}
                    />
                    <IconButton
                      aria-label="delete"
                      disabled={typeof pertanyaan.jawaban === "object"}
                      onClick={handleDelete}
                    >
                      <DeleteIcon
                        color={
                          typeof pertanyaan.jawaban == "number" ? "error" : ""
                        }
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
