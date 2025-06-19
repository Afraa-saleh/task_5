import React, { useState, useEffect } from "react";
import { Container, Row, Col, Nav, Tab, Form, Button, Pagination, Spinner, Alert } from "react-bootstrap";
import Sidebar from "./Sidebar";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useItemContext } from "../../Context/ItemContext";
interface Product {
  id: number;
  price: string;
  name: string;
  image_url: string;
}

const Dashboard: React.FC = () => {
  const { items } = useItemContext()
  // const filteredProducts = items.filter((product) =>
  //   product.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  const [key, setKey] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(8);

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setItemsPerPage(2); // small screens: 2 item
      } else if (width >= 768 && width <= 992) {
        setItemsPerPage(3); // medium screens: 3 items
      }
      else {
        setItemsPerPage(8); // large screens: 8 items
      }
    };

    updateItemsPerPage(); 
    window.addEventListener("resize", updateItemsPerPage); 

    return () => {
      window.removeEventListener("resize", updateItemsPerPage);
    };
  }, []);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");


      if (!token) {
        console.warn("can not found token .. go back to login page");
        navigate("/login");
        return;

      }

      try {
        const response = await axios.get("https://web-production-3ca4c.up.railway.app/api/items", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        console.log(response);

        setProducts(response.data);
      } catch (err: any) {
        console.error("can not get items", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("something is خطأ ");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container fluid className="d-flex overflow-x-hidden overflow-y-hidden dashboard-container">
      <Row>
        <Col xs={3} md={2} className="p-0">
          <Sidebar
            userName="anna"
            userImage="/User.png"
            storeLogo="/logo.png"
          />
        </Col>
      </Row>
      <Row className="d-flex align-items-center justify-content-center m-row-db"

      >
        <Col xs={9} md={10}>
          <Tab.Container activeKey={key} onSelect={(k) => setKey(k || "products")}>
            <Nav
              variant="tabs"
              className="d-flex justify-content-between align-items-center p-3"
            >
              <Row className="p-3 min-height-db" >
                <Col xs={12} className="d-flex justify-content-between align-items-center">
                  <div className="d-flex search-box">
                    <Form.Control className="search-input"
                      type="text"
                      placeholder="Search Items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      
                    />
                    <Button
                      variant="success"
                      onClick={() => navigate("/add-item")}
                      className="text-uppercase btn-add-item"
                    >
                      Add item
                    </Button>
                  </div>
                </Col>
              </Row>

            </Nav>

            <Tab.Content className="mt-3">
              <Tab.Pane eventKey="products">
                {loading ? (
                  <div className="text-center mt-5">
                    <Spinner animation="border" variant="primary" />
                    <p>Loading items...</p>
                  </div>
                ) : error ? (
                  <Alert variant="danger">{error}</Alert>
                ) : (
                  <>
                   <Row className="gx-3 gy-4 justify-content-start px-2" style={{ minHeight: "400px" }}>

                      {displayedProducts.length > 0 ? (
                        displayedProducts.map((product, index) => (
                          <Col key={index} xs={12} sm={12} md={6} lg={3}>
                            <ProductCard
                              id={product.id}
                              itemName={product.name}
                              ItemPrice={product.price}
                              itemImage={product.image_url}
                            />
                          </Col>
                        ))
                      ) : (
                        <p className="text-center w-100 mt-3">No items found</p>
                      )}
                    </Row>

                    <div className="d-flex justify-content-center mt-4">
                      <Pagination className="custom-pagination">
                        {[...Array(totalPages)].map((_, index) => (
                          <Pagination.Item
                            key={index + 1}
                            active={currentPage === index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </Pagination.Item>
                        ))}
                      </Pagination>
                    </div>

                  </>
                )}
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
