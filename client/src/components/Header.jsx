import * as React from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import PersonIcon from '@mui/icons-material/Person';
import { UserProvider, useUser } from "./UserContext";

function Header() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  const { setUser } = useUser()

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu()
    setUser(null)
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  const handleNewPlanClick = () => {
    navigate("/new-plan");
    handleCloseUserMenu();
  };

  const handleDashboardClick = () => {
    navigate("/home");
  };

  const handleTrainingPlanClick = () => {
    navigate("/training-plan");
  };

  return (
    <UserProvider>
      <AppBar position="static">
        <Container maxWidth="false" sx={{ backgroundColor: "#1c1c1c" }}>
          <Toolbar disableGutters>
            <Box
              onClick={handleDashboardClick}
              sx={{ cursor: "pointer" }}
              display={"flex"}
              alignItems={"center"}
            >
              <img
                className="runner-logo"
                src="https://cdn-icons-png.flaticon.com/512/233/233064.png"
              ></img>
              <Typography
                variant="h6"
                noWrap
                component="a"
                sx={{
                  mr: 2,
                  ml: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                OptiRun
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="#ff8961"
              >
                <MenuIcon />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <Button
                onClick={handleDashboardClick}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Dashboard
              </Button>
              <Button
                onClick={handleTrainingPlanClick}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Training Plan
              </Button>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="https://static.vecteezy.com/system/resources/previews/019/879/186/original/user-icon-on-transparent-background-free-png.png" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleNewPlanClick}>
                  <Typography textAlign="center">New Training Plan</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center"> Logout </Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </UserProvider>
  );
}
export default Header;
