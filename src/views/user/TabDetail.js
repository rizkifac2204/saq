// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

const DemoGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    paddingTop: `${theme.spacing(1)} !important`,
  },
}));

const TabDetail = (props) => {
  const { detail, handleDeleteClick } = props;
  if (!detail)
    return <Skeleton variant="rectangular" width={"100%"} height={118} />;

  return (
    <Card>
      <CardContent sx={{ paddingBottom: 0 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={3}>
                <Typography color={"primary"}>Detail User</Typography>
              </Grid>
              <DemoGrid item xs={12} sm={9}>
                <Typography variant="subtitle1">: {detail.nama}</Typography>
                <Typography variant="body2">
                  {detail.jabatan && (
                    <>
                      {detail.jabatan}
                      <br />
                    </>
                  )}
                  {detail.telp && (
                    <>
                      {detail.telp}
                      <br />
                    </>
                  )}
                  {detail.email && (
                    <>
                      {detail.email}
                      <br />
                    </>
                  )}
                </Typography>
              </DemoGrid>

              {detail.daftarWilayah ? (
                <>
                  <Grid item xs={12} sm={3}>
                    <Typography>Wilayah</Typography>
                  </Grid>
                  <DemoGrid item xs={12} sm={9}>
                    <Typography color="secondary">
                      {detail.daftarWilayah
                        .map((t, idx) => <span key={idx}>{t.provinsi}</span>)
                        .reduce((prev, curr) => [prev, ", ", curr])}
                    </Typography>
                  </DemoGrid>
                </>
              ) : (
                <></>
              )}

              {detail.provinsi ? (
                <>
                  <Grid item xs={12} sm={3}>
                    <Typography>Provinsi</Typography>
                  </Grid>
                  <DemoGrid item xs={12} sm={9}>
                    <Typography variant="subtitle1">
                      : {detail.provinsi}
                    </Typography>
                  </DemoGrid>
                </>
              ) : (
                <></>
              )}

              {detail.kabkota ? (
                <>
                  <Grid item xs={12} sm={3}>
                    <Typography>Kabupaten / Kota</Typography>
                  </Grid>
                  <DemoGrid item xs={12} sm={9}>
                    <Typography variant="subtitle1">
                      : {detail.kabkota}
                    </Typography>
                  </DemoGrid>
                </>
              ) : (
                <></>
              )}
            </Grid>

            <Typography color={"primary"} sx={{ my: 5 }}>
              Badan Publik
            </Typography>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={3}>
                <Typography>Badan Publik</Typography>
              </Grid>
              <DemoGrid item xs={12} sm={9}>
                <Typography variant="subtitle1">: {detail.bp}</Typography>
              </DemoGrid>

              <Grid item xs={12} sm={3}>
                <Typography>Website</Typography>
              </Grid>
              <DemoGrid item xs={12} sm={9}>
                <Typography variant="subtitle1">
                  : {detail.bp_website}
                </Typography>
              </DemoGrid>

              <Grid item xs={12} sm={3}>
                <Typography>Telp / Fax</Typography>
              </Grid>
              <DemoGrid item xs={12} sm={9}>
                <Typography variant="subtitle1">{detail.bp_fax}</Typography>
              </DemoGrid>

              <Grid item xs={12} sm={3}>
                <Typography>Email</Typography>
              </Grid>
              <DemoGrid item xs={12} sm={9}>
                <Typography variant="subtitle1">{detail.bp_email}</Typography>
              </DemoGrid>

              <Grid item xs={12} sm={3}>
                <Typography>Alamat</Typography>
              </Grid>
              <DemoGrid item xs={12} sm={9}>
                <Typography variant="subtitle1">{detail.bp_alamat}</Typography>
              </DemoGrid>
            </Grid>

            <Typography color={"primary"} sx={{ my: 5 }}>
              PPID
            </Typography>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={3}>
                <Typography>PPID</Typography>
              </Grid>
              <DemoGrid item xs={12} sm={9}>
                <Typography variant="subtitle1">
                  : {detail.ppid_nama}
                </Typography>
              </DemoGrid>

              <Grid item xs={12} sm={3}>
                <Typography>Telp PPID</Typography>
              </Grid>
              <DemoGrid item xs={12} sm={9}>
                <Typography variant="subtitle1">{detail.ppid_telp}</Typography>
              </DemoGrid>

              <Grid item xs={12} sm={3}>
                <Typography>Email PPID</Typography>
              </Grid>
              <DemoGrid item xs={12} sm={9}>
                <Typography variant="subtitle1">{detail.ppid_email}</Typography>
              </DemoGrid>
            </Grid>
          </Grid>

          <Grid
            item
            sm={6}
            xs={12}
            sx={{
              display: "flex",
              marginTop: [7.5, 2.5],
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img width={183} alt="avatar" src="/pose-m-2.png" />
          </Grid>
        </Grid>
      </CardContent>

      <Divider sx={{ margin: 0, mt: 3 }} />

      <CardContent>
        <Box>
          <Button
            variant="outlined"
            color="error"
            size="small"
            sx={{ marginRight: 3.5 }}
            disabled={!detail.editable}
            onClick={handleDeleteClick}
          >
            Hapus
          </Button>
          {detail.level > 2 ? (
            <Button variant="contained" color="info" size="small">
              Lihat Jawaban
            </Button>
          ) : (
            <></>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TabDetail;
