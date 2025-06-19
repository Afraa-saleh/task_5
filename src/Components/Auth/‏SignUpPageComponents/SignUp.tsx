import axios from "axios";
import { useRef, useState, type FormEvent } from "react";
import { Container, Form, Button, Row, Col, Card, Image } from "react-bootstrap";

const SignUp = () => {
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const userNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const profileImageRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string>("./public/Upload icon.png");

  const handleImageChange = () => {
    const file = profileImageRef.current?.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSignUp = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("first_name", firstNameRef.current?.value || "");
    formData.append("last_name", lastNameRef.current?.value || "");
    formData.append("user_name", userNameRef.current?.value || "");
    formData.append("email", emailRef.current?.value || "");
    formData.append("password", passwordRef.current?.value || "");
    formData.append("password_confirmation", confirmPasswordRef.current?.value || "");

    if (profileImageRef.current?.files?.[0]) {
      formData.append("profile_image", profileImageRef.current.files[0]);
    }

    axios.post("https://web-production-3ca4c.up.railway.app/api/register", formData, {
      headers: { Accept: "application/json", "Content-Type": "multipart/form-data" }
    })
      .then(res => console.log("Registered:", res.data))
      .catch(err => console.error("Error Response:", err.response?.data));
  };

  return (
    <Container fluid
    className="d-flex justify-content-center align-items-center min-vh-100 signup-container">
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Card  className="p-4 shadow login-signup-card signup-card">
            <Card.Body className="d-flex flex-column align-items-center ">
               <div
              className="mb-4 d-flex justify-content-center align-items-center login-logo signup-logo"
            >
              <img
                src="./public/logo.png"
                alt="logo"
              />
            </div>
              <h2 className="text-center text-uppercase login-signup-title">Sign Up</h2>

              <p   className="text-center mb-4">Fill in the following fields to create an account.</p>

              <Form onSubmit={handleSignUp}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      {/* <Form.Label>First Name</Form.Label> */}
                      <Form.Control  type="text" placeholder="First Name" ref={firstNameRef} required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      {/* <Form.Label>Last Name</Form.Label> */}
                      <Form.Control type="text" placeholder="Last Name" ref={lastNameRef} required  />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  {/* <Form.Label>Username</Form.Label> */}
                  <Form.Control type="text" placeholder="Username" ref={userNameRef} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  {/* <Form.Label>Email</Form.Label> */}
                  <Form.Control type="email" placeholder="Enter email" ref={emailRef} required />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      {/* <Form.Label>Password</Form.Label> */}
                      <Form.Control type="password" placeholder="Enter password" ref={passwordRef} required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      {/* <Form.Label>Confirm Password</Form.Label> */}
                      <Form.Control type="password" placeholder="Re-enter your password" ref={confirmPasswordRef} required />
                    </Form.Group>
                  </Col>
                </Row>

               <Form.Group className="mb-3">
  <Form.Label>Profile Image</Form.Label>

  <div
    onClick={() => profileImageRef.current?.click()}
    style={{
      width: "100px",
      height: "100px",
      borderRadius: "4px",
      border: "1px dashed rgba(56, 78, 183, 0.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      marginBottom: "8px",
      cursor: "pointer" 
    }}
  >
    <Image src={imagePreview} alt="Profile Preview" fluid />
  </div>

  <Form.Control 
    type="file"
    ref={profileImageRef}
    onChange={handleImageChange}
    accept="image/*"
    style={{ display: "none" }}
  />

  {profileImageRef.current?.value && (
    <small className="text-muted mt-1 d-block">
      {profileImageRef.current?.value.split("\\").pop()}
    </small>
  )}
</Form.Group>

                <Button variant="primary" type="submit" className="text-uppercase login-button ">Sign Up</Button>

                <p className="text-center mt-3"
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "100%",
                }}>
                  Already have an account? <a href="/signin"  style={{
                    fontFamily: "Montserrat",
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#FEAF00",
                    cursor: "pointer",
                  }}>Sign In</a>
                </p>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;
