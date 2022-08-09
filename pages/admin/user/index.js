import { useState, useEffect } from "react";
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
// ICONS
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
// component
import { CustomToolbar } from "src/views/table/TableComponents";

function User() {
  const router = useRouter();
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/user`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {});
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
