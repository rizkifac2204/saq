// ** Icon imports
import HomeIcon from "@mui/icons-material/Home";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const navigation = () => {
  return [
    {
      title: "Dashboard",
      icon: HomeIcon,
      path: "/admin",
      role: [1, 2, 3, 4],
    },
    {
      title: "Profile",
      icon: AdminPanelSettingsIcon,
      path: "/admin/profile",
      role: [1, 2, 3, 4],
    },
    {
      sectionTitle: "Management Pertanyaan",
      role: [1, 2, 3],
    },
    {
      title: "Pertanyaan",
      icon: ImportContactsIcon,
      path: "/admin/quest",
      role: [1, 2, 3],
    },
    {
      sectionTitle: "Management User",
      role: [1, 2, 3],
    },
    {
      title: "User",
      icon: PeopleAltIcon,
      path: "/admin/user",
      role: [1, 2, 3],
    },
    {
      title: "Tambah User",
      icon: PersonAddIcon,
      path: "/admin/user/add",
      role: [1, 2, 3],
    },
    {
      sectionTitle: "Kuesioner",
      role: [3, 4],
    },
    {
      title: "Kuesioner",
      icon: MenuBookIcon,
      path: "/admin/kuesioner",
      role: [3, 4],
    },
  ];
};

export default navigation;
