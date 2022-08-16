import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
//MUI
import Grid from "@mui/material/Grid";
// Components
import PoinList from "src/views/quest/PoinList";
import PertanyaanList from "src/views/quest/PertanyaanList";

export default function Quest() {
  const [isLoadingPoin, setIsLoadingPoin] = useState(false);
  const [isLoadingPertanyaan, setIsLoadingPertanyaan] = useState(false);
  const [data, setData] = useState([]);
  const [pertanyaan, setPertanyaan] = useState([]);
  const [curPoin, setCurPoin] = useState({});

  const getPertanyaan = (poin_id) => {
    setIsLoadingPertanyaan(true);
    axios
      .get(`/api/quest/manajemen/${poin_id}/pertanyaan`)
      .then((res) => {
        setPertanyaan(res.data);
      })
      .catch((err) => {
        toast.error("Terjadi Kesalahan");
      })
      .then(() => setIsLoadingPertanyaan(false));
  };

  function fetchPoin() {
    setIsLoadingPoin(true);
    axios
      .get(`/api/quest/manajemen`)
      .then((res) => {
        setData(res.data);
        if (res.data.length !== 0) {
          getPertanyaan(res.data[0].id);
          setCurPoin(res.data[0]);
        }
      })
      .catch((err) => {
        toast.error("Terjadi Kesalahan");
      })
      .then(() => setIsLoadingPoin(false));
  }

  useEffect(() => {
    fetchPoin();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <PoinList
          data={data}
          setData={setData}
          isLoadingPoin={isLoadingPoin}
          curPoin={curPoin}
          setCurPoin={setCurPoin}
          getPertanyaan={getPertanyaan}
          fetchPoin={fetchPoin}
        />
      </Grid>
      <Grid item xs={12} md={9}>
        <PertanyaanList
          poin={data}
          pertanyaan={pertanyaan}
          setPertanyaan={setPertanyaan}
          isLoadingPertanyaan={isLoadingPertanyaan}
          curPoin={curPoin}
          getPertanyaan={getPertanyaan}
        />
      </Grid>
    </Grid>
  );
}
