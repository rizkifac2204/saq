import jwtDecode from "jwt-decode";
import cookie from "cookie";

const isLogin = async (req, res) => {
  try {
    const { saqBawaslu } = cookie.parse(req.headers.cookie);
    if (!saqBawaslu)
      return res.status(401).json({ message: "Akses Tidak Dikenal" });
    const decoded = jwtDecode(saqBawaslu);
    res.json(decoded);
  } catch (err) {
    res.status(401).json({ message: "Akses Tidak Dikenal" });
  }
};

export default isLogin;
