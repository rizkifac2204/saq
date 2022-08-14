import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// Components
import PoinList from "src/views/quest/PoinList";
import PoinAdd from "src/views/quest/PoinAdd";

export default function Quest() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(true);
  const [openForm, setOpenForm] = useState(false);

  function fetchPoin() {
    axios
      .get(`/api/quest/manajemen`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        toast.error("Terjadi Kesalahan");
      });
  }

  useEffect(() => {
    fetchPoin();
  }, []);

  const deletePoin = (id) => {
    const ask = confirm(
      "Menghapus Poin akan menghapus semua pertanyaan pada poin tersebut, lanjutkan?"
    );
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
          toast.update(toastProses, {
            render: err.response.data.message,
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        });
    }
  };

  // progress =>
  // atur router jika klik
  // selected list
  // get pertanyaan

  return (
    <>
      <PoinList
        open={open}
        setOpen={setOpen}
        openForm={openForm}
        setOpenForm={setOpenForm}
        data={data}
        deletePoin={deletePoin}
      />

      <PoinAdd
        open={openForm}
        onClose={() => setOpenForm(false)}
        fetchPoin={fetchPoin}
      />
    </>
  );
}
