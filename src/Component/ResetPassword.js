import React, { useState, useEffect } from 'react';
import axios from 'axios';
import customLogo from "../Component/mainlogo.png";
import { useLocation, useNavigate } from 'react-router-dom';
import "./login.css";
import {
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBRow,
    MDBCol,
} from "mdb-react-ui-kit";

const API_BASE_URL = "https://recruitmentapi.iykons.com";

const imageStyle = {
    display: "block",
    margin: "0 auto",
    width: "100px",
    height: "auto",
};

const imageStyle1 = {
    display: "block",
    margin: "0 auto",
    width: "60%",
    height: "auto",
};

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenFromUrl = params.get('token');
        if (tokenFromUrl) {
            setMessage(''); // Clear any previous error message
        } else {
            setMessage('Invalid or missing token');
        }
    }, [location.search]);

    const handleResetPassword = async () => {
        if (!email) {
            setMessage('Email is required.');
            return;
        }
        if (newPassword.length < 8) {
            setMessage('Password must be at least 8 characters long.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/Account/reset-password`,
                { email, newPassword }
            );

            if (response && response.data) {
                setMessage('Password has been reset successfully');
                // Redirect to login page after 3 seconds
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setMessage('Invalid response from the server');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setMessage('Error: ' + error.response.data.message);
            } else {
                setMessage('An error occurred while making the request');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <MDBContainer className="my-5">
                <MDBCard>
                    <MDBRow className="g-0">
                        <MDBCol md="6">
                            <img src={customLogo} alt="Custom Logo" style={imageStyle} />
                            <div>
                                <h2
                                    className="h2"
                                    style={{
                                        color: "rgb(2, 83, 204)",
                                        display: "block",
                                        textAlign: "center",
                                        textDecoration: "underline",
                                    }}
                                >
                                    Begin Your Journey With{" "}
                                    <span className="sp" style={{ fontWeight: "bold" }}>
                                        IYKONS
                                    </span>
                                </h2>
                                <h7
                                    className="h3"
                                    style={{
                                        color: "rgb(2, 83, 204)",
                                        display: "block",
                                        textAlign: "center",
                                    }}
                                >
                                    Begin your business with the right assistance.
                                </h7>
                            </div>
                            <MDBCardImage
                                src={process.env.PUBLIC_URL + "/login.png"}
                                alt="login form"
                                style={imageStyle1}
                            />
                        </MDBCol>

                        <MDBCol md="6" style={{ backgroundColor: "rgb(2, 83, 204)" }}>
                            <MDBCardBody className="d-flex flex-column">
                                <div className="d-flex flex-row mt-2">
                                    <span className="h1 fw-bold mb-0" style={{ color: "white" }}>
                                        Reset Your Password
                                    </span>
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    className="fw-normal my-2 pb-3"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    className="fw-normal my-2 pb-3"
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    className="fw-normal my-2 pb-3"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button onClick={handleResetPassword} disabled={isLoading}>
                                    {isLoading ? 'Resetting...' : 'Reset Password'}
                                </button>
                                <div>{message}</div>
                            </MDBCardBody>
                        </MDBCol>
                    </MDBRow>
                </MDBCard>
            </MDBContainer>
        </div>
    );
}

export default ResetPassword;
