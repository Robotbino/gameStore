import {
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function UserAvatar() {
  const { userEmail, logout } = useAuth();
  const navigate = useNavigate();

  const initial = userEmail ? userEmail.charAt(0).toUpperCase() : "?";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <div className="user-avatar" id="userAvatar">
          {initial}
        </div>
      </MenuTrigger>
      <MenuContent
        bg="#1a1a1a"
        borderColor="#2a2a2a"
        borderWidth="1px"
        borderRadius="10px"
        boxShadow="0 8px 32px rgba(0, 0, 0, 0.5)"
        p="3"
        minW="160px"
      >
        <MenuItem
          value="profile"
          bg="transparent"
          color="#e8e8e8"
          borderRadius="6px"
          p="2"
          fontSize="0.85rem"
          _hover={{ bg: "#2a2a2a" }}
        >
          Profile
        </MenuItem>
        <MenuItem
          value="settings"
          bg="transparent"
          color="#e8e8e8"
          borderRadius="6px"
          p="2"
          fontSize="0.85rem"
          _hover={{ bg: "#2a2a2a" }}
        >
          Settings
        </MenuItem>
        <MenuSeparator borderColor="#2a2a2a" />
        <MenuItem
          value="logout"
          onClick={handleLogout}
          bg="transparent"
          color="#e8e8e8"
          p="2"
          borderRadius="6px"
          fontSize="0.85rem"
          _hover={{ bg: "#2a2a2a", color: "#F5C518" }}
        >
          Log out
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
}
