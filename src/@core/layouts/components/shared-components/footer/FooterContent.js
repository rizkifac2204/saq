// ** MUI Imports
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

const FooterContent = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography sx={{ mr: 2 }}>
        {`© ${new Date().getFullYear()}, Bawaslu Republik Indonesia `}
        {` by `}
        <Link target="_blank" href="http://loremit.com/">
          Lorem IT
        </Link>
      </Typography>
    </Box>
  );
};

export default FooterContent;
