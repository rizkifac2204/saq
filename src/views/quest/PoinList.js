import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// MUI
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
import Skeleton from "@mui/material/Skeleton";
// icon
import ArrowRight from "@mui/icons-material/ArrowRight";
import AddIcon from "@mui/icons-material/Add";
import BallotIcon from "@mui/icons-material/Ballot";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
// Components
import PoinAdd from "src/views/quest/PoinAdd";
import PoinEdit from "src/views/quest/PoinEdit";

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

export default function PoinList(props) {
  const [openForm, setOpenForm] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [detailTemp, setDetailTemp] = useState({});
  const {
    data,
    setData,
    isLoadingPoin,
    curPoin,
    setCurPoin,
    getPertanyaan,
    fetchPoin,
  } = props;

  const deletePoin = (id) => {
    const ask = confirm("yakin lanjutkan?");
    if (ask) {
      const toastProses = toast.loading("Tunggu Sebentar...", {
        autoClose: false,
      });
      axios
        .delete(`/api/quest/manajemen/${id}`)
        .then((res) => {
          setTimeout(() => {
            setData((prev) => prev.filter((row) => row.id != id));
          });
          toast.update(toastProses, {
            render: res.data.message,
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
        })
        .catch((err) => {
          const msg = err.response.data.message || "Terjadi Kesalahan";
          if (msg.includes("a foreign key")) {
            msg =
              "Gagal, Harus Menghapus Pertanyaan Pada Poin Tersebut Terlebih Dahulu";
          }
          console.log(msg);
          toast.update(toastProses, {
            render: msg,
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        });
    }
  };

  const editPoin = (item) => {
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
                <BallotIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Poin"
                primaryTypographyProps={{
                  color: "primary",
                  fontWeight: "medium",
                  variant: "body2",
                }}
              />
            </ListItemButton>
            <Tooltip title="Tambah Poin" onClick={() => setOpenForm(true)}>
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
          {isLoadingPoin && <Skeleton variant="rounded" height={60} />}
          <Box>
            {!isLoadingPoin && data.length !== 0 ? (
              data.map((item, idx) => (
                <ListItem
                  selected={item.id === curPoin.id}
                  key={item.id}
                  sx={{ p: 0 }}
                  secondaryAction={
                    <>
                      <IconButton
                        edge="end"
                        aria-label="Edit"
                        onClick={() => editPoin(item)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => deletePoin(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <Tooltip title={item.penjelasan}>
                    <ListItemButton
                      onClick={() => {
                        setCurPoin(item);
                        getPertanyaan(item.id);
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            gutterBottom
                            component="div"
                            noWrap
                          >
                            {item.poin}. {item.penjelasan}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" align="center" sx={{ my: 3 }}>
                Poin Belum Terdeteksi
              </Typography>
            )}
          </Box>
        </FireNav>
      </Card>

      <PoinAdd
        open={openForm}
        onClose={() => setOpenForm(false)}
        fetchPoin={fetchPoin}
      />

      <PoinEdit
        detailTemp={detailTemp}
        open={openEditForm}
        onClose={() => {
          setOpenEditForm(false);
          setDetailTemp({});
        }}
        fetchPoin={fetchPoin}
      />
    </>
  );
}
