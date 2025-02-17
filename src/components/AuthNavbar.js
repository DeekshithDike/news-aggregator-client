// src/components/AuthNavbar.js
import { Box, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function AuthNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        borderBottom: "1px solid #ccc",
      }}
    >
      <Typography variant="h6">News Portal</Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button component={Link} to="/news">
          News
        </Button>
        <Button component={Link} to="/preferences">
          Preferences
        </Button>
        <Button onClick={handleLogout}>Logout</Button>
      </Box>
    </Box>
  );
}

export default AuthNavbar;
