import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";

// MUI
import Card from "@mui/material/Card";
import {
  DataGrid,
  GridActionsCellItem,
  GridLinkOperator,
} from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";
import Switch from "@mui/material/Switch";
// ICONS
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
// component
import AuthContext from "context/AuthContext";
import { CustomToolbar } from "src/views/table/TableComponents";

const ShowKolomkab = (profile) => {
  if (profile === null || profile.level < 3) return true;
  return false;
};
const ShowKolomAdmin = (profile) => {
  if (profile === null || profile.level > 2) return true;
  return false;
};

function User() {
  const { user: profile } = useContext(AuthContext);
  const router = useRouter();
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/user`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {})
      .then(() => setLoading(false));
  }, []);

  const handleDeleteSelected = () => {
    const ask = confirm("Yakin Hapus Data Terpilih?");
    if (ask) {
      const toastProses = toast.loading("Tunggu Sebentar...", {
        autoClose: false,
      });
      axios
        .delete(`/api/user`, { data: selected })
        .then((res) => {
          setTimeout(() => {
            setUsers((prevRows) =>
              prevRows.filter((row) => !selected.includes(row.id))
            );
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
  const handleDeleteClick = (id) => {
    const ask = confirm("Yakin Hapus Data?");
    if (ask) {
      const toastProses = toast.loading("Tunggu Sebentar...", {
        autoClose: false,
      });
      axios
        .delete(`/api/user/` + id)
        .then((res) => {
          setTimeout(() => {
            setUsers((prev) => prev.filter((row) => row.id != id));
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

  const actionColumn = (values) => {
    if (values.row.myself) {
      return [
        <GridActionsCellItem
          key="0"
          icon={<ManageAccountsIcon />}
          label="Profile"
          onClick={() => router.push("/admin/profile")}
        />,
        <SwitchAction />,
      ];
    }
    if (values.row.editable) {
      return [
        <GridActionsCellItem
          key="1"
          icon={<ManageAccountsIcon />}
          label="Detail dan Edit"
          onClick={() => router.push("/admin/user/" + values.id)}
        />,
        <GridActionsCellItem
          key="2"
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteClick(values.id)}
        />,
      ];
    } else {
      return [
        <GridActionsCellItem
          key="0"
          icon={<VisibilityIcon />}
          label="Detail"
          onClick={() => router.push("/admin/user/" + values.id)}
        />,
      ];
    }
  };

  const handleSwitchAdmin = (detail) => {
    const toastProses = toast.loading("Tunggu Sebentar...", {
      autoClose: false,
    });
    axios
      .put(`/api/user/${detail.id}/switchAdmin`)
      .then((res) => {
        setTimeout(() => {
          setUsers((prev) =>
            prev.map((row) => {
              if (row.id == detail.id)
                return { ...row, pengelola: res.data.value };
              return row;
            })
          );
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
      })
      .then(() => {});
  };

  const SwitchAction = ({ detail }) => {
    if (!detail) return <></>;
    const check = detail.pengelola ? true : false;
    return (
      <Switch checked={check} onChange={() => handleSwitchAdmin(detail)} />
    );
  };

  const adminColumn = (values) => {
    if (values.row.level === 3) {
      return [<SwitchAction detail={values.row} />];
    }
    return [];
  };

  const columns = [
    {
      field: "nama_level",
      headerName: "Role",
      minWidth: 180,
    },
    {
      field: "nama",
      headerName: "Nama Admin",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "provinsi",
      headerName: "Provinsi",
      minWidth: 180,
    },
    {
      field: "kabkota",
      headerName: "Kabupaten/Kota",
      minWidth: 180,
      hide: ShowKolomkab(profile),
    },
    {
      field: "telp",
      headerName: "Telp/HP",
      minWidth: 180,
      hide: true,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 180,
      hide: true,
    },
    {
      field: "bp",
      headerName: "Badan Publik",
      minWidth: 180,
      hide: true,
    },
    {
      field: "ppid_nama",
      headerName: "PPID",
      minWidth: 180,
      hide: true,
    },
    {
      field: "actionsadmin",
      type: "actions",
      headerName: "Admin",
      width: 100,
      cellClassName: "actions",
      getActions: (values) => adminColumn(values),
      hide: ShowKolomAdmin(profile),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 200,
      cellClassName: "actions",
      getActions: (values) => actionColumn(values),
    },
  ];

  return (
    <>
      <Card>
        <DataGrid
          loading={loading}
          autoHeight
          rows={users}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 20, 50]}
          checkboxSelection
          isRowSelectable={(params) => Boolean(params.row.editable)}
          disableSelectionOnClick
          onSelectionModelChange={(itm) => setSelected(itm)}
          components={{
            LoadingOverlay: LinearProgress,
            Toolbar: CustomToolbar,
          }}
          componentsProps={{
            toolbar: {
              selectedItem: selected,
              handleDeleteSelected: handleDeleteSelected,
              multiSearch: true,
            },
          }}
          columnBuffer={8}
          initialState={{
            filter: {
              filterModel: {
                items: [],
                quickFilterLogicOperator: GridLinkOperator.Or,
              },
            },
          }}
        />
      </Card>
    </>
  );
}

export default User;
