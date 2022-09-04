import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
//MUI
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
// Components
import ListPertanyaan from "src/views/kuesioner/ListPertanyaan";
import ListPoin from "src/views/kuesioner/ListPoin";

const LembarKuesioner = ({ curPoin, isLoadingCurrent, data, setData }) => {
  if (isLoadingCurrent) return <Skeleton variant="rounded" height={300} />;
  if (Object.keys(curPoin).length === 0)
    return (
      <Typography variant="h6" color="secondary">
        Pertanyaan Tidak Ditemukan
      </Typography>
    );

  return (
    <List
      sx={{ width: "100%", bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          {curPoin.poin}. {curPoin.penjelasan}
        </ListSubheader>
      }
    >
      {curPoin.pertanyaan.map((pertanyaan) => (
        <ListPertanyaan
          key={pertanyaan.id}
          pertanyaan={pertanyaan}
          curPoin={curPoin}
          data={data}
          setData={setData}
        />
      ))}
    </List>
  );
};

export default function Kuesioner() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCurrent, setIsLoadingCurrent] = useState(false);
  const [data, setData] = useState([]);
  const [curPoin, setCurPoin] = useState({});

  const getCurrentPoin = (poin_id) => {
    setIsLoadingCurrent(true);
    setCurPoin({});
    axios
      .get(`/api/kuesioner/${poin_id}`)
      .then((res) => {
        setCurPoin(res.data);
      })
      .catch((err) => {
        toast.error("Terjadi Kesalahan");
      })
      .then(() => setIsLoadingCurrent(false));
  };

  useEffect(() => {
    function getKuesioner() {
      setIsLoading(true);
      axios
        .get(`/api/kuesioner`)
        .then((res) => {
          setData(res.data);
          getCurrentPoin(res.data[0].id);
        })
        .catch((err) => {
          toast.error("Terjadi Kesalahan");
        })
        .then(() => setIsLoading(false));
    }
    getKuesioner();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" component="div" color={"secondary"}>
            DAFTAR PERTANYAAN KETERBUKAAN INFORMASI BAWASLU
          </Typography>
        </Grid>
        <Grid item xs={12} md={3} mb={10}>
          <ListPoin
            data={data}
            isLoading={isLoading}
            curPoin={curPoin}
            getCurrentPoin={getCurrentPoin}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <LembarKuesioner
            curPoin={curPoin}
            setCurPoin={setCurPoin}
            isLoadingCurrent={isLoadingCurrent}
            data={data}
            setData={setData}
          />
        </Grid>
      </Grid>
    </>
  );
}
