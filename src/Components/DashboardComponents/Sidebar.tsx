import React from "react";
import { Container, Nav, Navbar, Image, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { AiFillProduct } from "react-icons/ai";
import { CiBookmark, CiLogout } from "react-icons/ci";


interface SidebarProps {
  userName: string;
  userImage: string;
  storeLogo: string;
}


const Sidebar: React.FC<SidebarProps> = ({ userName, userImage, storeLogo }) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await fetch("https://web-production-3ca4c.up.railway.app/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      localStorage.removeItem("token");

      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("An error occurred while logging out.");
    }
  };

  return (
    <Navbar  variant="dark" className="d-flex flex-column vh-100 p-3 sidebard-content">
      <Container className="text-center d-flex align-items-center justify-content-center">
        <Image src={storeLogo} className="sidebar-img-logo" rounded />
      </Container>

      <Container className="mt-3 text-center d-flex justify-content-center sidebar-img-profile">
        <Image src={userImage} width={100} height={100} roundedCircle />
      </Container>
        <h5 className="text-black mt-2 user-name-title">{userName}</h5>

      <Nav className="flex-column mt-4 align-items-center justify-content-center">
        <Button variant="secondary" className="mb-2 text-black active-btn sidebar-btns"><AiFillProduct /> Products</Button>
        <Button variant="secondary" className="mb-2 text-black sidebar-btns"><CiBookmark /> Favorites</Button>
        <Button variant="secondary" className="mb-2 text-black sidebar-btns"><CiBookmark /> order list</Button>
      </Nav>

      <div className="mt-auto text-center">
        <Button className="sidebar-btns" onClick={handleLogout} style={{width:"193px", height:"41px", background:"transparent", border:"none", color:"#000000"}}><CiLogout /> Log out</Button>
      </div>
    </Navbar>
  );
};

export default Sidebar;
