import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Image,
  Spinner,
  Alert,
  Card,
  Modal,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../DashboardComponents/Sidebar";
import ButtonBackComponent from "../AdditionalComponents/ButtonBackComponent";

const API_BASE = "https://web-production-3ca4c.up.railway.app";

const EditItem: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const profileImageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token not found. Please login.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE}/api/items/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = response.data;
        setName(data.name || "");
        setPrice(data.price?.toString() || "");
        setPreviewImage(
          data.image?.startsWith("http") ? data.image : `${API_BASE}${data.image}`
        );
        setLoading(false);
      } catch (err) {
        setError("Failed to load item details. Try again later.");
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    } else {
      setError("Item ID is missing in the URL.");
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token not found. Please login.");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      if (image) {
        formData.append("image", image);
      }
      formData.append("_method", "PUT");

      await axios.post(`${API_BASE}/api/items/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setShowConfirm(true);
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item. Check your input.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleConfirmYes = () => {
    setShowConfirm(false);
    navigate("/dashboard");
  };

  const handleConfirmNo = () => {
    setShowConfirm(false);
  };

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

        {/* Main Content */}
        <Col xs={12} md={9} lg={10} className="p-4">
          <ButtonBackComponent />


          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p className="mt-3">Loading item details...</p>
            </div>
          ) : error ? (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          ) : (
            <Card className="p-4 shadow-sm bg-white card-additem">
              <h2 className="mb-4 text-uppercase fw-bold">Edit Item</h2>
              <Form onSubmit={handleSubmit}>
                <Row>
                  {/* Fields - Left */}
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="label-size">Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter item name"
                        required
                        style={{ height: "44px" }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="mt-5 label-size">Price</Form.Label>
                      <Form.Control
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Enter item price"
                        required
                        style={{ height: "44px" }}
                      />
                    </Form.Group>
                  </Col>

                  {/* Image - Right */}
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="label-size">Image</Form.Label>
                      <div
                        className="d-flex align-items-center justify-content-center overflow-hidden bg-white add-item-img-box"
                        onClick={() => profileImageRef.current?.click()}
                        style={{
                          border: "1px dashed #ccc",
                          height: "209px",
                          cursor: "pointer",
                        }}
                      >
                        {previewImage ? (
                          <Image
                            src={previewImage}
                            alt="Preview"
                            width={150}
                            height={150}
                            style={{ objectFit: "cover" }}
                            onError={(e: any) => {
                              e.target.src = "/Default.png";
                              
                            }}
                          />
                        ) : (
                          <Image
                            src="/Upload icon.png"
                            alt="Upload"
                            width={110}
                            height={100}
                          />
                        )}
                      </div>

                      <Form.Control
                        type="file"
                        ref={profileImageRef}
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex align-items-center justify-content-center">
                  <Button
                    variant="success"
                    type="submit"
                    className="mt-3 btn-save"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" animation="border" className="me-2" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </Form>
            </Card>
          )}
        </Col>
      </Row>

      {/* Confirmation Modal */}
      <Modal
        show={showConfirm}
        onHide={handleConfirmNo}
        centered
        backdrop="static"
      >
        <Modal.Body className="text-center p-4">
          <h5 className="mb-4">Item updated successfully. Go back to dashboard?</h5>
          <div className="d-flex justify-content-center gap-4">
            <Button variant="warning" onClick={handleConfirmYes}>
              Yes
            </Button>
            <Button variant="secondary" onClick={handleConfirmNo}>
              No
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default EditItem;

