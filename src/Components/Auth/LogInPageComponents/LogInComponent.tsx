
import axios from "axios";
import { useRef, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
const LogInComponent = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSignIn = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    
    formData.append("email", emailRef.current?.value || "");
    formData.append("password", passwordRef.current?.value || "");

    axios.post("https://web-production-3ca4c.up.railway.app/api/login", formData, {
      headers: { Accept: "application/json" }
    })
    .then(res => {
      localStorage.setItem("token", res.data.token);
      console.log("Logged in:", res.data);
      navigate("/dashboard");
    })
    .catch(err => console.log("Login Error:", err.response?.data));
  };


 return (
   <Container fluid className="login-container">
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Card className="login-signup-card">
            <Card.Body className="d-flex flex-column align-items-center">
              <div className="login-logo">
                <img src="./public/logo.png" alt="logo" />
              </div>

              <h1 className="login-signup-title">Sign In</h1>
              <p className="login-signup-subtitle ">
                Enter your credentials to access your account
              </p>

              <Form
                onSubmit={handleSignIn}
                className="w-100 d-flex flex-column align-items-center"
              >
                <Form.Group className="mb-3 login-form-group">
                  <Form.Label className="login-signup-label">Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    ref={emailRef}
                    required
                    className="login-input"
                  />
                </Form.Group>

                <Form.Group className="mb-4 login-form-group">
                  <Form.Label className="login-signup-label">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    ref={passwordRef}
                    required
                    className="login-input"
                  />
                </Form.Group>

                <Button type="submit" className="login-button">
                  Sign In
                </Button>

                <Form.Text className="text-center mt-3 login-prompt">
                  Don't Have An Account?{" "}
                  <span className="signup-link" onClick={() => navigate("/signup")}>
                    Sign Up
                  </span>
                </Form.Text>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LogInComponent;
