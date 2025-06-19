import React, { useState, useEffect } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useItemContext } from "../../Context/ItemContext";

interface CardProps {
  id: number;
  itemName: string;
  ItemPrice: string;
  itemImage: string;
}

const API_BASE = "https://web-production-3ca4c.up.railway.app";

const ProductCard: React.FC<CardProps> = ({ id, itemName, ItemPrice, itemImage }) => {
  const [hover, setHover] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("/Default.png");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const navigate = useNavigate();
  const { setSelectedItem } = useItemContext();

  useEffect(() => {
    if (!itemImage) return;
    if (/^https?:\/\//.test(itemImage)) {
      setImageSrc(itemImage);
    } else {
      setImageSrc(`${API_BASE}${itemImage}`);
    }
  }, [itemImage]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setResultMessage("No token found. Please log in.");
        setShowResultModal(true);
        return;
      }

      const response = await fetch(`${API_BASE}/api/items/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Delete failed.");
      }

      setResultMessage("Item was deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      setResultMessage("Failed to delete the item.");
    } finally {
      setShowConfirmModal(false);
      setShowResultModal(true);
    }
  };

  return (
    <>
      <Card
        className="position-relative overflow-hidden card-body"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{boxShadow:"8px 8px 8px gray"}}
      >
        <Card.Img
          variant="top"
          src={imageSrc}
          alt={itemName}
          onError={() => setImageSrc("/Default.png")}
          className="card-img"
        />
        <Card.Body className="text-center">
          <Card.Title className="d-none">{itemName}</Card.Title>
          <Card.Text className="d-none">{ItemPrice}</Card.Text>
        </Card.Body>

        {hover && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-dark bg-opacity-75">
            <h2
              className="card-title-hover"
              onClick={() => {
                setSelectedItem({ id, name: itemName, price: ItemPrice, image: itemImage });
                navigate(`/items/${id}`);
              }}
            >
              {itemName}
            </h2>

            <div className="d-flex justify-content-between card-btns-content">
              <Button
                variant="warning"
                className="card-btns"
                onClick={() => navigate(`/edit/${id}`)}
              >
                Edit
              </Button>
              <Button
                className="card-btns btn-delete"
                onClick={() => setShowConfirmModal(true)}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Body className="text-center p-4">
          <h5 className="mb-4">Are you sure you want to delete this item?</h5>
          <div className="d-flex justify-content-center gap-4">
            <Button variant="danger" onClick={handleDelete}>
              Yes, Delete
            </Button>
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Result Message Modal */}
      <Modal show={showResultModal} onHide={() => {
        setShowResultModal(false);
        if (resultMessage.includes("successfully")) {
          window.location.reload();
        }
      }} centered>
        <Modal.Body className="text-center p-4">
          <h5>{resultMessage}</h5>
          <Button variant="primary" className="mt-3" onClick={() => {
            setShowResultModal(false);
            if (resultMessage.includes("successfully")) {
              window.location.reload();
            }
          }}>
            OK
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProductCard;
