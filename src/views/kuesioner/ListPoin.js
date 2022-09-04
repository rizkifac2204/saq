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
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Chip from "@mui/material/Chip";
// icon
import BallotIcon from "@mui/icons-material/Ballot";

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

const ChipProgres = ({ obj }) => {
  const label = obj.jumlahTerjawab + " / " + obj.jumlahPertanyaan;
  const isDone =
    (100 / obj.jumlahPertanyaan) * obj.jumlahTerjawab === 100 ? true : false;
  const attrs = {
    variant: isDone ? "filled" : "outlined",
    color: isDone ? "success" : "secondary",
    label: label,
  };
  if (Object.keys(obj).length === 0)
    return <Chip variant="outlined" label="0" color="error" />;
  return <Chip {...attrs} />;
};

export default function ListPoin(props) {
  const { data, isLoading, curPoin, getCurrentPoin } = props;

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
          </ListItem>
          <Divider sx={{ mt: 0 }} />
          {isLoading && <Skeleton variant="rounded" height={60} />}
          <Box>
            {!isLoading && data.length !== 0 ? (
              data.map((item, idx) => (
                <ListItem
                  selected={item.id === curPoin.id}
                  key={item.id}
                  sx={{ p: 0 }}
                >
                  <Tooltip title={item.penjelasan}>
                    <>
                      <ListItemButton
                        onClick={() => {
                          getCurrentPoin(item.id);
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

                      <ListItemIcon>
                        <ChipProgres obj={item.statuspertanyaan} />
                      </ListItemIcon>
                    </>
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
    </>
  );
}
