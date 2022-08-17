import { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
// MUI
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const handleSubmit = (values, props) => {
  const toastProses = toast.loading("Tunggu Sebentar...", { autoClose: false });
  axios
    .put(
      `/api/quest/manajemen/${props.curPoin.id}/pertanyaan/${props.detailTemp.id}`,
      values
    )
    .then((res) => {
      props.getPertanyaan(props.curPoin.id);
      setTimeout(() => props.onClose(), 1000);
      toast.update(toastProses, {
        render: res.data.message,
        type: res.data.type,
        isLoading: false,
        autoClose: 2000,
      });
    })
    .catch((err) => {
      console.log(err.response.data);
      toast.update(toastProses, {
        render: err.response.data.message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    });
};

const validationSchema = yup.object({
  nomor: yup.number().required("Harus Diisi"),
  pertanyaan: yup.string().required("Harus Diisi"),
  penjelasan: yup.string().required("Harus Diisi"),
});

function PertanyaanEdit(props) {
  const { detailTemp } = props;
  const formik = useFormik({
    initialValues: {
      nomor: detailTemp.nomor ? detailTemp.nomor : "",
      pertanyaan: detailTemp.pertanyaan ? detailTemp.pertanyaan : "",
      penjelasan: detailTemp.penjelasan ? detailTemp.penjelasan : "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => handleSubmit(values, props),
  });

  useEffect(() => {
    if (props.open) formik.resetForm();
  }, [props.open]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      fullScreen={props.fullScreen}
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Edit Pertanyaan Nomor {detailTemp.nomor}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            required
            type="number"
            margin="normal"
            label="Nomor Pertanyaan"
            name="nomor"
            value={formik.values.nomor}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.nomor && Boolean(formik.errors.nomor)}
            helperText={formik.touched.nomor && formik.errors.nomor}
          />

          <TextField
            fullWidth
            required
            margin="normal"
            label="Pertanyaan"
            name="pertanyaan"
            value={formik.values.pertanyaan}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.pertanyaan && Boolean(formik.errors.pertanyaan)
            }
            helperText={formik.touched.pertanyaan && formik.errors.pertanyaan}
          />

          <TextField
            fullWidth
            required
            margin="normal"
            label="Penjelasan"
            name="penjelasan"
            value={formik.values.penjelasan}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.penjelasan && Boolean(formik.errors.penjelasan)
            }
            helperText={formik.touched.penjelasan && formik.errors.penjelasan}
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit">Update dan Tutup</Button>
          <Button onClick={props.onClose} type="button">
            Tutup
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default PertanyaanEdit;
