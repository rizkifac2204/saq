import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
//MUI
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
// icons
import AllOutIcon from "@mui/icons-material/AllOut";
import AddTaskIcon from "@mui/icons-material/AddTask";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import GradeIcon from "@mui/icons-material/Grade";
// Components
import ListPertanyaanResult from "src/views/kuesioner/result/ListPertanyaanResult";
import CardStats from "views/kuesioner/result/CardStats";
import StatisticsCard from "views/kuesioner/result/StatisticsCard";

const ListPoin = (props) => {
  const { poin } = props;
  return (
    <List
      sx={{ width: "100%", bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          <Typography variant="orange">
            {poin.poin}. {poin.penjelasan}
          </Typography>
        </ListSubheader>
      }
    >
      {poin.pertanyaan.map((pertanyaan) => (
        <ListPertanyaanResult key={pertanyaan.id} pertanyaan={pertanyaan} />
      ))}
    </List>
  );
};

function UserResult() {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [detail, setDetail] = useState({});
  const [data, setData] = useState([]);
  const [total, setTotal] = useState({
    poin: 0,
    pertanyaan: 0,
    terjawab: 0,
    belum: 0,
    ya: 0,
    tidak: 0,
    url: 0,
    file: 0,
    grade: 0,
    graded: 0,
  });

  function getTotalPoin(array) {
    setTotal((prev) => {
      return { ...prev, poin: array.length };
    });
  }

  function getTotalPertanyaan(array) {
    const pertanyaan = array.reduce((prev, curr) => {
      return prev + curr.pertanyaan.length;
    }, 0);
    setTotal((prev) => {
      return { ...prev, pertanyaan: pertanyaan };
    });
  }

  function getTotalTerjawab(array) {
    const terjawab = array.reduce((prev, curr) => {
      return (
        prev +
        curr.pertanyaan.filter((i) => {
          if (i.jawaban !== null) {
            return true;
          } else {
            return false;
          }
        }).length
      );
    }, 0);
    setTotal((prev) => {
      return { ...prev, terjawab: terjawab };
    });
  }

  function getTotalBelum(array) {
    const belum = array.reduce((prev, curr) => {
      return (
        prev +
        curr.pertanyaan.filter((i) => {
          if (i.jawaban === null) {
            return true;
          } else {
            return false;
          }
        }).length
      );
    }, 0);
    setTotal((prev) => {
      return { ...prev, belum: belum };
    });
  }

  function getTotalYa(array) {
    const ya = array.reduce((prev, curr) => {
      return (
        prev +
        curr.pertanyaan.filter((i) => {
          if (i.jawaban === 1) {
            return true;
          } else {
            return false;
          }
        }).length
      );
    }, 0);
    setTotal((prev) => {
      return { ...prev, ya: ya };
    });
  }

  function getTotalTidak(array) {
    const tidak = array.reduce((prev, curr) => {
      return (
        prev +
        curr.pertanyaan.filter((i) => {
          if (i.jawaban === 0) {
            return true;
          } else {
            return false;
          }
        }).length
      );
    }, 0);
    setTotal((prev) => {
      return { ...prev, tidak: tidak };
    });
  }

  function getTotalUrl(array) {
    const url = array.reduce((prev, curr) => {
      return (
        prev +
        curr.pertanyaan.filter((i) => {
          if (i.url !== null) {
            return true;
          } else {
            return false;
          }
        }).length
      );
    }, 0);
    setTotal((prev) => {
      return { ...prev, url: url };
    });
  }

  function getTotalFile(array) {
    const file = array.reduce((prev, curr) => {
      return (
        prev +
        curr.pertanyaan.filter((i) => {
          if (i.file !== null) {
            return true;
          } else {
            return false;
          }
        }).length
      );
    }, 0);
    setTotal((prev) => {
      return { ...prev, file: file };
    });
  }

  function getTotalGrade(array) {
    const graded = array.reduce((prev, curr) => {
      return (
        prev +
        curr.pertanyaan.filter((i) => {
          if (i.nilai !== null) {
            return true;
          } else {
            return false;
          }
        }).length
      );
    }, 0);
    const grade = array.reduce((prev, curr) => {
      return (
        prev +
        curr.pertanyaan.reduce((a, b) => {
          if (b.nilai !== null) {
            return +(a + Number(b.nilai)).toFixed(1);
          } else {
            return a + 0;
          }
        }, 0)
      );
    }, 0);
    const total = (grade / graded).toFixed(1);
    setTotal((prev) => {
      return { ...prev, grade: Number(total), graded: Number(graded) };
    });
  }

  const settingTotal = (array) => {
    getTotalPoin(array);
    getTotalPertanyaan(array);
    getTotalTerjawab(array);
    getTotalBelum(array);
    getTotalYa(array);
    getTotalTidak(array);
    getTotalUrl(array);
    getTotalFile(array);
    getTotalGrade(array);
  };

  function getKuesioner(user_id) {
    setIsLoading(true);
    axios
      .get(`/api/user/${user_id}/result`)
      .then((res) => {
        setData(res.data);
        settingTotal(res.data);
      })
      .catch((err) => {
        toast.error("Terjadi Kesalahan");
      })
      .then(() => setIsLoading(false));
  }

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/user/${id}`)
        .then((res) => {
          setDetail(res.data);
          getKuesioner(res.data.id);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          setTimeout(() => router.push("/admin/user"), 1000);
        });
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // MULAI DARI SINI
  // GRADE PADA SETIAP PERTANYAAN DIEDIT OLEH ADMIN DAN AKAN MERUBAH NILAI

  return (
    <>
      <Grid container spacing={3} mb={2}>
        <Grid item xs={6} md={3}>
          <CardStats
            stats={total.pertanyaan}
            icon={<AllOutIcon />}
            color="primary"
            trendNumber={`${total.poin} poin`}
            title="Total Pertanyaan"
            subtitle="Total Keseluruhan"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <CardStats
            stats={total.terjawab}
            icon={<AddTaskIcon />}
            color="success"
            title="Terjawab"
            subtitle="Total Keseluruhan"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <CardStats
            stats={total.belum}
            icon={<DoNotDisturbIcon />}
            color="warning"
            title="Belum Terjawab"
            subtitle="Total Keseluruhan"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <CardStats
            stats={
              <Rating
                name="half-rating-read"
                value={total.grade}
                precision={0.5}
                readOnly
              />
            }
            icon={<GradeIcon />}
            color="info"
            title="Grade Total"
            subtitle={`Rata-rata dari ${total.graded} Ternilai`}
          />
        </Grid>
        <Grid item xs={12}>
          <StatisticsCard total={total} />
        </Grid>
      </Grid>

      {isLoading && <Skeleton variant="rounded" height={300} />}

      {!isLoading &&
        data.length !== 0 &&
        data.map((poin) => <ListPoin key={poin.id} poin={poin} />)}
    </>
  );
}

export default UserResult;
