import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
// icon
import ArrowRight from "@mui/icons-material/ArrowRight";
import AddIcon from "@mui/icons-material/Add";
import BallotIcon from "@mui/icons-material/Ballot";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const { data, open, setOpen, setOpenForm, deletePoin } = props;
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Paper elevation={0} sx={{ maxWidth: 256 }}>
          <FireNav component="nav" disablePadding>
            <ListItem component="div" disablePadding>
              <ListItemButton
                sx={{ height: 56 }}
                onClick={() => setOpen(!open)}
              >
                <ListItemIcon>
                  <BallotIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Poin Pertanyaan"
                  primaryTypographyProps={{
                    color: "primary",
                    fontWeight: "medium",
                    variant: "body2",
                  }}
                />
              </ListItemButton>
              <Tooltip
                title="Tambah Poin Pertanyaan"
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
            {data.length === 0 && <Skeleton variant="rounded" height={60} />}
            <Box>
              {open &&
                data.map((item, idx) => (
                  <ListItem
                    selected={idx === 0}
                    key={item.id}
                    sx={{ p: 0 }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => deletePoin(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <Tooltip placement="right" title={item.penjelasan}>
                      <ListItemButton>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              gutterBottom
                              component="div"
                              noWrap
                            >
                              {item.penjelasan}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              gutterBottom
                              component="div"
                              color={"info.light"}
                              noWrap
                            >
                              Poin Nomor {item.poin}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                ))}
            </Box>
          </FireNav>
        </Paper>
      </Box>
    </>
  );
}
