// ** Icon imports
import HomeIcon from "@mui/icons-material/Home";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";

const navigation = () => {
  return [
    {
      title: "Dashboard",
      icon: HomeIcon,
      path: "/admin",
    },
    {
      title: "Profile",
      icon: AdminPanelSettingsIcon,
      path: "/admin/profile",
    },
    {
      sectionTitle: "Management Pertanyaan",
    },
    {
      title: "Pertanyaan",
      icon: RequestQuoteIcon,
      path: "/admin/quest",
    },
    {
      sectionTitle: "Management User",
    },
    {
      title: "User",
      icon: PeopleAltIcon,
      path: "/admin/user",
    },
    {
      title: "Tambah User",
      icon: PersonAddIcon,
      path: "/admin/user/add",
    },
  ];
};

export default navigation;
