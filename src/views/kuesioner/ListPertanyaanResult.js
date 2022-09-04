import { useState } from "react";
import axios from "axios";
import validator from "validator";
//MUI
import Grid from "@mui/material/Grid";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Rating from "@mui/material/Rating";
// ICONS
import CloseIcon from "@mui/icons-material/Close";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

const labels = {
  0.5: "Buruk",
  1: "Buruk+",
  1.5: "Cukup",
  2: "Cukup+",
  2.5: "Kurang Baik",
  3: "Kurang Baik+",
  3.5: "Baik",
  4: "Baik+",
  4.5: "Sangat Baik",
  5: "Sangat Baik+",
};

const DisplayJawaban = ({ val }) => {
  const display =
    val == 1 ? (
      <Chip label="Ya" variant="outlined" color="success" />
    ) : (
      <Chip label="Tidak" variant="outlined" color="error" />
    );
  if (val == null) return <DoNotDisturbIcon color="error" />;
  return display;
};

const DisplayKeterangan = ({ val }) => {
  if (val == null)
    return (
      <Typography variant="caption">
        <b>Keterangan</b> : -
      </Typography>
    );
  return (
    <Typography variant="caption">
      <b>Keterangan</b> : {val || "-"}
    </Typography>
  );
};

const DisplayUrl = ({ val }) => {
  if (val == null)
    return (
      <IconButton>
        <LinkOffIcon color={"error"} />
      </IconButton>
    );
  return (
    <IconButton
      onClick={() => {
        window.open(val, "_blank");
      }}
    >
      <LinkIcon color={"success"} />
    </IconButton>
  );
};

const DisplayFile = ({ val }) => {
  if (val == null)
    return (
      <IconButton>
        <CloudOffIcon color={"error"} />
      </IconButton>
    );
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <Box>
        <a
          href={"/api/services/file/public/upload/" + val}
          target="_blank"
          rel="noreferrer"
        >
          <Typography variant="body2" gutterBottom mt={2}>
            {val}
          </Typography>
        </a>
      </Box>
      <Box>
        <a href={"/api/services/file/public/upload/" + val} download>
          <IconButton>
            <CloudDownloadIcon />
          </IconButton>
        </a>
      </Box>
    </Box>
  );
};

const ListPertanyaanResult = (props) => {
  // state
  const [pertanyaan, setPertanyaan] = useState(props.pertanyaan);

  return (
    <>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ListItemText
                primary={`${pertanyaan.nomor}. ${pertanyaan.pertanyaan}`}
                secondary={`— ${pertanyaan.penjelasan}`}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ mx: 2 }}>
                  <DisplayJawaban val={pertanyaan.jawaban} />
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ mx: 3, flexGrow: 1 }}>
                  <DisplayKeterangan val={pertanyaan.keterangan} />
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      flexWrap: "wrap",
                    }}
                  >
                    <Stack direction="row" spacing={2}>
                      <DisplayUrl val={pertanyaan.url} />
                      <DisplayFile val={pertanyaan.file} />
                    </Stack>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Rating
                name="half-rating-read"
                value={Number(pertanyaan.nilai) || 0}
                precision={0.5}
                readOnly
              />
              {pertanyaan.nilai !== null ? (
                <Box sx={{ ml: 2 }}>
                  <Typography variant="caption">
                    {labels[Number(pertanyaan.nilai)]}
                  </Typography>{" "}
                </Box>
              ) : (
                // <Box sx={{ ml: 2 }}>{labels[Number(pertanyaan.nilai)]}</Box>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="caption">Belum Dinilai</Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Divider />
    </>
  );
};

export default ListPertanyaanResult;
