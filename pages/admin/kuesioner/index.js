import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
//MUI
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
// Components
import ListPertanyaan from "src/views/kuesioner/ListPertanyaan";

const ListPoin = (props) => {
  const { poin } = props;
  return (
    <List
      sx={{ width: "100%", bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          {poin.poin}. {poin.penjelasan}
        </ListSubheader>
      }
    >
      {poin.pertanyaan.map((pertanyaan) => (
        <ListPertanyaan key={pertanyaan.id} pertanyaan={pertanyaan} />
      ))}
    </List>
  );
};

export default function Quest() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  function getKuesioner() {
    setIsLoading(true);
    axios
      .get(`/api/kuesioner`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        toast.error("Terjadi Kesalahan");
      })
      .then(() => setIsLoading(false));
  }

  useEffect(() => {
    getKuesioner();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Typography variant="h6" component="div">
        DAFTAR PERTANYAAN KETERBUKAAN INFORMASI BAWASLU
      </Typography>

      {isLoading && <Skeleton variant="rounded" height={300} />}

      {!isLoading &&
        data.length !== 0 &&
        data.map((poin) => <ListPoin key={poin.id} poin={poin} />)}
    </>
  );
}
