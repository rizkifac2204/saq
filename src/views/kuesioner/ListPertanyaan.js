import { useState } from "react";
import axios from "axios";
import validator from "validator";
//MUI
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";

//components
import FileAction from "views/kuesioner/FileAction";

const ListPertanyaan = ({ pertanyaan }) => {
  const [jawaban, setJawaban] = useState(pertanyaan.jawaban);
  const [keterangan, setKeterangan] = useState(pertanyaan.keterangan);
  const [url, setUrl] = useState(pertanyaan.url);
  const [file, setFile] = useState(pertanyaan.file);

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

  const handleAnswer = (event, kolom) => {
    const { value, name } = event.target;
    if (!value) return;

    if (name === "url") {
      if (!validator.isURL(value)) {
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
      [name]: value,
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
      })
      .then(() => {});
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
            <Grid container spacing={2}>
              <Grid item xs>
                <FormControl>
                  <RadioGroup
                    name="jawaban"
                    value={jawaban}
                    onChange={(event) => handleAnswer(event, "jawaban")}
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
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={4}>
                  <TextField
                    fullWidth
                    label="Keterangan"
                    variant="outlined"
                    size="small"
                    multiline
                    rows={2}
                    name="keterangan"
                    value={keterangan ? keterangan : ""}
                    onChange={(event) => setKeterangan(event.target.value)}
                    onBlur={(event) => handleAnswer(event, "keterangan")}
                  />
                  <TextField
                    fullWidth
                    label="URL"
                    variant="outlined"
                    size="small"
                    name="url"
                    value={url ? url : ""}
                    onChange={(event) => setUrl(event.target.value)}
                    onBlur={(event) => handleAnswer(event, "url")}
                  />
                </Stack>
              </Grid>
              <Grid item xs>
                <Stack
                  direction="row"
                  divider={<Divider orientation="vertical" flexItem />}
                  spacing={2}
                >
                  <FileAction
                    path="pemberitahuan"
                    namaFile="file_surat_pemberitahuan"
                    data={""}
                    responses={""}
                    setResponses={""}
                  />
                  <IconButton aria-label="delete">
                    <DeleteIcon color="error" />
                  </IconButton>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ListItem>
      <Divider />
    </>
  );
};

export default ListPertanyaan;
