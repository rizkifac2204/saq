// ** React Imports
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { styled } from "@mui/material/styles";
import MuiTab from "@mui/material/Tab";

// ** Icons Imports
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

// ** Tabs Imports
import TabDetail from "src/views/user/TabDetail";
import TabEdit from "src/views/user/TabEdit";

// ** Third Party Styles Imports
import "react-datepicker/dist/react-datepicker.css";

const Tab = styled(MuiTab)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    minWidth: 100,
  },
  [theme.breakpoints.down("sm")]: {
    minWidth: 67,
  },
}));

const TabName = styled("span")(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: "0.875rem",
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const AccountSettings = () => {
  // ** State
  const router = useRouter();
  const [detail, setDetail] = useState({});
  const { id } = router.query;
  const [value, setValue] = useState("detail");

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/user/${id}`)
        .then((res) => {
          setDetail(res.data);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          setTimeout(() => router.push("/admin/user"), 1000);
        });
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDeleteClick = () => {
    const ask = confirm(
      "Menghapus user akan serta manghapus jawaban jika sudah mengisi, lanjutkan?"
    );
    if (ask) {
      const toastProses = toast.loading("Tunggu Sebentar...", {
        autoClose: false,
      });
      axios
        .delete(`/api/user/` + id)
        .then((res) => {
          toast.update(toastProses, {
            render: res.data.message,
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
          setTimeout(() => router.push("/admin/user"), 1000);
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

  return (
    <Card>
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label="account-settings tabs"
          sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
        >
          <Tab
            value="detail"
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AssignmentIndIcon />
                <TabName>Detail User</TabName>
              </Box>
            }
          />
          {detail.editable && (
            <Tab
              value="edit"
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ManageAccountsIcon />
                  <TabName>Edit</TabName>
                </Box>
              }
            />
          )}
        </TabList>

        <TabPanel sx={{ p: 0 }} value="detail" index={0}>
          <TabDetail
            detail={detail}
            setDetail={setDetail}
            handleDeleteClick={handleDeleteClick}
          />
        </TabPanel>
        {detail.editable && (
          <TabPanel sx={{ p: 0 }} value="edit" index={1}>
            <TabEdit
              detail={detail}
              setDetail={setDetail}
              handleDeleteClick={handleDeleteClick}
            />
          </TabPanel>
        )}
      </TabContext>
    </Card>
  );
};

export default AccountSettings;
