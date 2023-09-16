import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "@/components/FlexBetween";
import LanIcon from "@mui/icons-material/Lan";
import { ColorModeContext, tokens } from "../../theme";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";

const Navbar: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [selected, setSelected] = useState<"home" | "other page">("home");

  return (
    <FlexBetween mb="0.25rem" p="0.5rem 0rem" color={colors.primary[100]}>
      {/* LEFT SIDE */}
      <FlexBetween gap="0.75rem">
        <LanIcon sx={{ fontSize: "28px" }} />
        <Typography variant="h4" fontSize="16px">
          Wake On LAN
        </Typography>
      </FlexBetween>

      {/* RIGHT SIDE */}
      <FlexBetween gap="2rem">
        <Box sx={{ "&:hover": { color: colors.blueAccent[500] } }}>
          <Link
            to="/"
            onClick={() => setSelected("home")}
            style={{
              color: selected === "home" ? "inherit" : colors.primary[500],
              textDecoration: "inherit",
            }}
          >
            Home
          </Link>
        </Box>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
      </FlexBetween>
    </FlexBetween>
  );
};

export default Navbar;
