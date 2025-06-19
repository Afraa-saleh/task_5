import React, { useState } from 'react'
import { Button } from 'react-bootstrap';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

function ButtonBackComponent() {
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    const handleConfirmYes = () => {
        setShowConfirm(false);
        navigate("/dashboard");
    };
    return (
        <div>
            <Button
                variant="primary"
                className="bg-white btn-back"
                style={{ borderRadius: "50%", border: "1px solid black" }}
                onClick={handleConfirmYes}
            >
                <IoIosArrowBack />
            </Button>
        </div>
    )
}

export default ButtonBackComponent
