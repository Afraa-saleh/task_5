import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Image,
  Card,
  Spinner,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../DashboardComponents/Sidebar";
import { useItemContext } from "../../Context/ItemContext";
import { IoIosArrowBack } from "react-icons/io";
import { useRef } from "react";
import ButtonBackComponent from "../AdditionalComponents/ButtonBackComponent";

const AddItem: React.FC = () => {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState<number | null>(null);
  const [itemImage, setItemImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const profileImageRef = useRef<HTMLInputElement>(null);

  const { addItem } = useItemContext();
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setItemImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }

    if (!itemName || !itemPrice || !itemImage) {
      alert("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", itemName);
    formData.append("price", itemPrice.toString());
    formData.append("image", itemImage);

    try {
      setLoading(true);
      const response = await axios.post(
        "https://web-production-3ca4c.up.railway.app/api/items",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newItem = response.data.item;
      addItem(newItem);

      // Reset form
      setItemName("");
      setItemPrice(null);
      setItemImage(null);
      setPreviewImage("");

      setShowConfirm(true);
    } catch (error: any) {
      console.error("Error adding item:", error.response?.data || error.message);
      alert("Error adding item");
    } finally {
      setLoading(false);
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
         <ButtonBackComponent/>

          <Card className="p-4 shadow-sm bg-white card-additem">
            <h2 className="mb-4 text-uppercase" style={{ fontWeight: "900" }}>
              Add New Item
            </h2>

            <Form onSubmit={handleSubmit} className="bg-white">
              <Row>
                {/* Left side - Fields */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="label-size">Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter item name"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      required
                      style={{ height: "44px" }}

                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="mt-5 label-size" >Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter item price"
                      value={itemPrice ?? ""}
                      onChange={(e) => setItemPrice(Number(e.target.value))}
                      required
                      style={{ height: "44px" }}
                    />
                  </Form.Group>
                </Col>

                {/* Right side - Image */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="label-size">Image</Form.Label>

                    <div className="d-flex align-items-center justify-content-center overflow-hidden bg-white add-item-img-box"
                      onClick={() => profileImageRef.current?.click()}
                      
                    >
                      {previewImage ? (
                        <Image
                          src={previewImage}
                          alt="Preview"
                          width={150}
                          height={150}
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <Image
                          src="./public/Upload icon.png"
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
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setItemImage(file);
                          setPreviewImage(URL.createObjectURL(file));
                        }
                      }}
                      style={{ display: "none" }}
                      required
                    />

                    {profileImageRef.current?.value && (
                      <small className="text-muted mt-1 d-block">
                        {profileImageRef.current.value.split("\\").pop()}
                      </small>
                    )}
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
                    "Save Item"
                  )}
                </Button>
              </div>
            </Form>
          </Card>

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
          <h5 className="mb-4">Item Saved , Are you sure you want to go back to the dashboard?</h5>
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

export default AddItem;
