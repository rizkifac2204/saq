import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// ** MUI Imports
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
// icon
import ArrowRight from "@mui/icons-material/ArrowRight";
import AddIcon from "@mui/icons-material/Add";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
// Components
import PertanyaanAdd from "src/views/quest/PertanyaanAdd";
import PertanyaanEdit from "src/views/quest/PertanyaanEdit";

const FireNav = styled(List)({
  "& .MuiListItemButton-root": {
    paddingLeft: 24,
    paddingRight: 24,
  },
  "& .MuiListItemIcon-root": {
    minWidth: 0,
    marginRight: 16,
  },
  "& .MuiSvgIcon-root": {
    fontSize: 18,
  },
});

function PertanyaanList(props) {
  const [openForm, setOpenForm] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [detailTemp, setDetailTemp] = useState({});
  const {
    poin,
    pertanyaan,
    setPertanyaan,
    isLoadingPertanyaan,
    curPoin,
    getPertanyaan,
  } = props;

  const deletePertanyaan = (id) => {
    const ask = confirm(
      "Menghapus Poin akan menghapus semua jawaban beserta semua file upload pada pertanyaan tersebut, lanjutkan?"
    );
    if (ask) {
      const toastProses = toast.loading("Tunggu Sebentar...", {
        autoClose: false,
      });
      axios
        .delete(`/api/quest/manajemen/${curPoin.id}/pertanyaan/${id}`)
        .then((res) => {
          setTimeout(() => {
            setPertanyaan((prev) => prev.filter((row) => row.id != id));
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

  const editPertanyaan = (item) => {
    setOpenEditForm(true);
    setDetailTemp(item);
  };

  return (
    <>
      <Card>
        <FireNav component="nav" disablePadding>
          <ListItem component="div" disablePadding>
            <ListItemButton sx={{ height: 56 }}>
              <ListItemIcon>
                <QuestionAnswerIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    gutterBottom
                    component="div"
                    noWrap
                  >
                    Pertanyaan Poin {curPoin.poin}. {curPoin.penjelasan}
                  </Typography>
                }
                primaryTypographyProps={{
                  color: "primary",
                  fontWeight: "medium",
                  variant: "body2",
                }}
              />
            </ListItemButton>
            <Tooltip
              title="Tambah Pertanyaan"
              onClick={() => setOpenForm(true)}
            >
              <IconButton
                size="large"
                sx={{
                  "& svg": {
                    transition: "0.2s",
                    transform: "translateX(0) rotate(0)",
                  },
                  "&:hover, &:focus": {
                    bgcolor: "unset",
                    "& svg:first-of-type": {
                      transform: "translateX(-4px) rotate(-20deg)",
                    },
                    "& svg:last-of-type": {
                      right: 0,
                      opacity: 1,
                    },
                  },
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    height: "80%",
                    display: "block",
                    left: 0,
                    width: "1px",
                    bgcolor: "divider",
                  },
                }}
              >
                <AddIcon />
                <ArrowRight
                  sx={{ position: "absolute", right: 4, opacity: 0 }}
                />
              </IconButton>
            </Tooltip>
          </ListItem>
          <Divider sx={{ mt: 0 }} />
          <Box>
            <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
              <Table
                sx={{ minWidth: 650 }}
                stickyHeader
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="right">Nomor</TableCell>
                    <TableCell>Pertanyaan</TableCell>
                    <TableCell>Penjelasan</TableCell>
                    <TableCell align="right">Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoadingPertanyaan && (
                    <TableRow>
                      <TableCell align="center" colSpan={4}>
                        <Skeleton variant="rounded" height={60} />
                      </TableCell>
                    </TableRow>
                  )}
                  {!isLoadingPertanyaan && pertanyaan.length !== 0 ? (
                    pertanyaan.map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-of-type td, &:last-of-type th": {
                            border: 0,
                          },
                        }}
                      >
                        <TableCell align="right">{row.nomor}</TableCell>
                        <TableCell>{row.pertanyaan}</TableCell>
                        <TableCell>{row.penjelasan}</TableCell>
                        <TableCell align="right">
                          <>
                            <IconButton
                              edge="end"
                              aria-label="Edit"
                              onClick={() => editPertanyaan(row)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => deletePertanyaan(row.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell align="center" colSpan={4}>
                        Data Pertanyaan Tidak Ditemukan
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </FireNav>
      </Card>
      <PertanyaanAdd
        open={openForm}
        poin={poin}
        curPoin={curPoin}
        onClose={() => setOpenForm(false)}
        getPertanyaan={getPertanyaan}
      />
      <PertanyaanEdit
        open={openEditForm}
        detailTemp={detailTemp}
        poin={poin}
        curPoin={curPoin}
        onClose={() => setOpenEditForm(false)}
        getPertanyaan={getPertanyaan}
      />
    </>
  );
}

export default PertanyaanList;
