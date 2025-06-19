import React from "react";
import { Container, Row, Col, Image, Card, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useItemContext } from "../../Context/ItemContext";
import Sidebar from "../DashboardComponents/Sidebar";
import ButtonBackComponent from "../AdditionalComponents/ButtonBackComponent";

const API_BASE = "https://web-production-3ca4c.up.railway.app";

const DetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedItem } = useItemContext();

  if (!selectedItem || selectedItem.id !== Number(id)) {
    return (
      <Container fluid>
        <Row>
          {/* Sidebar */}
          <Col xs={12} md={3} lg={2} className="bg-dark text-white min-vh-100 p-0">
            <Sidebar
              userName="anna"
              userImage="/User.png"
              storeLogo="/logo.png"
            />
          </Col>

          <Col xs={12} md={9} lg={10} className="p-5 text-center">
            <h3 className="mb-4">Can't found</h3>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              back
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  const imageSrc = selectedItem.image?.startsWith("http")
    ? selectedItem.image
    : `${API_BASE}${selectedItem.image}`;

  return (
      <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col xs={12} md={3} lg={2} className="bg-light min-vh-100 p-0 border-end">
          <Sidebar userName="anna" userImage="/User.png" storeLogo="/logo.png" />
        </Col>

        {/* Content */}
        <Col xs={12} md={9} lg={10} className="p-5">
         <ButtonBackComponent/>

          <h1 className="text-start fw-bold item-details-name">{selectedItem.name}</h1>
          <div className="d-flex justify-content-center mb-4">
            <Image
              src={imageSrc}
              alt="Product"
              style={{ maxHeight: "300px", objectFit: "contain" }}
              onError={(e: any) => { e.target.src = "/Default.png"; }}
              fluid
            />
          </div>

          <div className="d-flex flex-wrap justify-content-center text-center gap-4 mt-4">
            <h3>
              <strong>Price:</strong>{" "}
              <span style={{ padding: "4px 8px", borderRadius: "5px" }}>
                {selectedItem.price}$ 
              </span>
            </h3>
            <h4 className="text-muted">
              <strong className="text-black">Added At:</strong> 30/12/2020
            </h4>
            <h4 className="text-muted">
              <strong className="text-black">Updated At:</strong> 30/12/2020
            </h4>
          </div>
        </Col>
      </Row>
    </Container>
  );
};


export default DetailsPage;
