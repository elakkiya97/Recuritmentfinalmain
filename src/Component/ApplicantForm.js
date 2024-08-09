import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import customLogo from "../Component/mainlogo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Component/css/Applicant.css";
import Job from "./job";
import APPQues from "./AppQues";
import Ack from "./Ack";
import {
  Steps,
  Input,
  Button,
  Radio,
  Select,
  DatePicker,
  Form,
  Row,
  Col,
  notification,
} from "antd";

import {
  MDBContainer,
  MDBCard,
  MDBCardImage,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";

import moment from "moment";
const API_BASE_URL = "https://recruitmentapi.iykons.com";

const applicantFormStyle = {
  flexDirection: "column",
  overflowy: "hidden",
};
const imageStyle = {
  display: "block",
  margin: "0 auto",
  width: "260px",
  height: "auto",
};

const imageStyle1 = {
  display: "block",
  width: "100%",
  height: "auto",
  marginTop: "40px",
};
const { Option } = Select;

const ApplicantForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedStep, setSelectedStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  
  const [applicantData, setApplicantData] = useState({
    title: "",
    dob: "22/09/2023",
    gender: "",
    phoneNo: "",
    email: "",

    country: "",
    city: "",
    street: "",
    state: "",
    zip: "",
    permanentAddress: "",
    residentialAddress: "",
  });
  const countryOptions = [
    { value: "us", label: "United States", code: "+1" },
    { value: "ca", label: "Canada", code: "+1" },
    { value: "gb", label: "United Kingdom", code: "+44" },
    { value: "au", label: "Australia", code: "+61", length: 15 },
    { value: "de", label: "Germany", code: "+49" },
    { value: "fr", label: "France", code: "+33" },
    { value: "it", label: "Italy", code: "+39" },
    { value: "es", label: "Spain", code: "+34" },
    { value: "mx", label: "Mexico", code: "+52" },
    { value: "jp", label: "Japan", code: "+81" },
    { code: "+94", label: "SriLanka", length: 9 },
    { value: "in", label: "India", code: "+91", length: 10 },
  ];
  const location = useLocation();
  const jwtToken = location.state ? location.state.token : null;


   const [formValues] = useState({
    // Initialize with empty or default values
    desiredLocation: '',
    isFullTimePosition: true,
    startDate: null,
    source: '',
    preferredContactMethod: '',
    refereename: '',
    refereephoneNo: '',
    refereeAddress: '',
    uploadedFile: null,
    positionName: ''
  });
  const handleChange = (name, value) => {
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));

    setApplicantData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < stepTitles.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedStep(currentStep + 1);
    }
  };
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSelectedStep(currentStep - 1);
    }
  };
  const handleNextStep = () => {
    setCurrentStep(0);
    setSelectedStep(0);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const [form] = Form.useForm();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await form.validateFields();
    } catch (error) {
      const errors = error.errorFields.reduce((acc, field) => {
        acc[field.name[0]] = field.errors[0];
        return acc;
      }, {});

      notification.error({
        description: Object.values(errors).join(", "),
      });
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/Applicant/App`, applicantData, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      handleNext();
    } catch (error) {
      notification.error({
        description: error.message,
      });
    }
  };

  const [, setIsAcknowledgmentSubmitted] = useState(false);
  const handleAcknowledgmentSubmit = (isSubmitted) => {
    setIsAcknowledgmentSubmitted(isSubmitted);
  };
  const stepTitles = [
    "Personal Details",
    "Experience Details",
    "Application Questions",
    "Acknowledgement",
  ];
  const disabledDate = (current) => {
    const today = moment().startOf("day");

    const minDate = today.clone().subtract(120, "years"); // 120 years ago
    const maxDate = today.clone().subtract(0, "years"); // Today

    return current && (current > maxDate || current < minDate);
  };

  const handleApp1queDataChange = (field, value) => {
    setApplicantData({
      ...applicantData,
      [field]: value,
    });
  };
  const customizeRequiredMark = (label, required) => (
    <>
      {label}
      {required && <span style={{ color: "red" }}>*</span>}
    </>
  );

  return (
    <div className="applicant-form-page" style={applicantFormStyle}>
      <header className="header">
        <img src={customLogo} alt="Custom Logo" style={imageStyle} />
      </header>
      <Steps
        current={currentStep}
        percent={60}
        style={{
          padding: "10px 0",
          width: "90%",
          display: "block",
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
          top: "-80px",
        }}
        items={stepTitles.map((title) => ({
          title,
        }))}
        itemRender={(item) => (
          <Steps.Item
            {...item}
            title={<span style={{ color: "blue" }}>{item.title}</span>}
          />
        )}
      />
      <main className="main">
        <MDBContainer className="my-5">
          <MDBCard>
            <MDBRow className="g-0">
              <MDBCol
                md="6"
                className="login-section"
                style={{ flexBasis: "35%" }}
              >
                <h1 className="application">{stepTitles[currentStep]}</h1>
                <MDBCardImage
                  src={process.env.PUBLIC_URL + "/login.png"}
                  alt="login form"
                  style={imageStyle1}
                />

                <ul className="applicant-list">
                  <li className="li">
                    Make your resume public to be visible to Hiring Employees.
                  </li>
                  <li className="li">
                    Speed up the application process with quick apply. You can
                    apply to jobs with just one click.
                  </li>
                  <li className="li">
                    See similar job titles and skills to help you make your next
                    move.
                  </li>
                </ul>
              </MDBCol>
              <MDBCol
                md="6"
                className="form-section"
                style={{ flexBasis: "65%", minHeight: "100vh" }}
              >
                <div>
                  <ul className="horizontal-list">
                    {stepTitles.map((title, index) => (
                      <li
                        key={index}
                        className={index === selectedStep ? "active-step" : ""}
                      >
                        {title}
                      </li>
                    ))}
                  </ul>

                  <Form
                    form={form}
                    requiredMark={(label, { required }) =>
                      customizeRequiredMark(label, required)
                    }
                  >
                    {currentStep === 0 && (
                      <div className="container" style={{ marginTop: "30px" }}>
                        <Row gutter={[16]}>
                          <Col span={12}>
                            <Form.Item
                              label={
                                <span>
                                  Title
                                  {/* <span >*</span> */}
                                </span>
                              }
                              name="title"
                              className="required-asterisk"
                              rules={[
                                {
                                  required: true,
                                  message: "Please select a title.",
                                },
                              ]}
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                            >
                              <Select
                                value={applicantData.title}
                                onChange={(value) =>
                                  handleChange("title", value)
                                }
                                placeholder="Title"
                                style={{ width: "100%" }}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                  option.children
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                              >
                                <Option value="Mr">Mr</Option>
                                <Option value="Mrs">Mrs</Option>
                                <Option value="Ms">Ms</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label={
                                <span>
                                  First Name
                                  {/* <span className="required-asterisk">*</span> */}
                                </span>
                              }
                              name="firstName"
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter your first name.",
                                },
                                {
                                  pattern: /^[a-zA-Z]+$/,
                                  message:
                                    "Only letters (a-z, A-Z) are allowed.",
                                },
                              ]}
                              //// required={false}
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                            >
                              <Input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={applicantData.firstName}
                                onChange={(e) =>
                                  handleChange("firstName", e.target.value)
                                }
                                placeholder="First Name"
                                style={{ width: "100%" }}
                              />
                              {validationErrors.firstName && (
                                <span style={{ color: "red" }}>
                                  {validationErrors.firstName}
                                </span>
                              )}
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label={
                                <span>
                                  Last Name
                                  {/* <span className="required-asterisk">*</span> */}
                                </span>
                              }
                              name="lastName"
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter your last name.",
                                },
                                {
                                  pattern: "^[a-zA-Z]+$",
                                  message:
                                    "Only letters (a-z, A-Z) are allowed.",
                                },
                              ]}
                              // required={false}
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                            >
                              <Input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={applicantData.lastName}
                                onChange={(e) =>
                                  handleChange("lastName", e.target.value)
                                }
                                placeholder="Last Name"
                                style={{ width: "100%" }}
                              />
                              {validationErrors.firstName && (
                                <span style={{ color: "red" }}>
                                  {validationErrors.firstName}
                                </span>
                              )}
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label={
                                <span>
                                  Email
                                  {/* <span className="required-asterisk">*</span> */}
                                </span>
                              }
                              name="email"
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter your email address.",
                                },
                                {
                                  type: "email",
                                  message:
                                    "Please enter a valid email address.",
                                },
                              ]}
                              // required={false}
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                            >
                              <Input
                                type="email"
                                id="email"
                                name="email"
                                value={applicantData.email}
                                onChange={(e) =>
                                  handleChange("email", e.target.value)
                                }
                                placeholder="Email"
                                style={{ width: "100%" }}
                              />
                              {validationErrors.firstName && (
                                <span style={{ color: "red" }}>
                                  {validationErrors.firstName}
                                </span>
                              )}
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label={
                                <span>
                                  Gender
                                  {/* <span className="required-asterisk">*</span> */}
                                </span>
                              }
                              name="gender"
                              rules={[
                                {
                                  required: true,
                                  message: "Please select your gender.",
                                },
                              ]}
                              // required={false}
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                            >
                              <Radio.Group
                                id="gender"
                                name="gender"
                                value={applicantData.gender}
                                onChange={(e) =>
                                  handleChange("gender", e.target.value)
                                }
                              >
                                <Radio value="male">Male</Radio>
                                <Radio value="female">Female</Radio>
                              </Radio.Group>
                              {validationErrors.firstName && (
                                <span style={{ color: "red" }}>
                                  {validationErrors.firstName}
                                </span>
                              )}
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label={
                                <span>
                                  DOB
                                  {/* <span className="required-asterisk">*</span> */}
                                </span>
                              }
                              name="dob"
                              rules={[
                                {
                                  required: true,
                                  message: "Please select your date of birth.",
                                },
                              ]}
                              // required={false}
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                            >
                              <DatePicker
                                id="dob"
                                name="dob"
                                selected={selectedDate}
                                disabledDate={disabledDate}
                                onChange={handleDateChange}
                                dateFormat="MM/dd/yyyy"
                                placeholderText="Select Date of Birth"
                                style={{ width: "100%" }}
                              />
                              {validationErrors.dob && (
                                <span style={{ color: "red" }}>
                                  {validationErrors.dob}
                                </span>
                              )}
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label={
                                <span>
                                  Phone Number
                                  {/* <span className="required-asterisk">*</span> */}
                                </span>
                              }
                              name="phoneNo"
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter the  phone no.",
                                },
                                {
                                  pattern: /^\+\d{11,15}$/,
                                  message: "Phone number must start with + .",
                                },
                              ]}
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                            >
                              <Input
                                type="tel"
                                value={applicantData.phoneNo}
                                onChange={(e) =>
                                  handleApp1queDataChange(
                                    "phoneNo",
                                    e.target.value
                                  )
                                }
                                placeholder="E.g. +94771473328"
                              />
                            </Form.Item>
                          </Col>

                          <Col span={12}>
                            <Form.Item
                              label={
                                <span>
                                  Country
                                  {/* <span className="required-asterisk">*</span> */}
                                </span>
                              }
                              name="country"
                              rules={[
                                {
                                  required: true,
                                  message:
                                    "Only letters (a-z, A-Z) are allowed.",
                                },
                              ]}
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                            >
                              <Select
                                id="country"
                                name="country"
                                value={applicantData.country}
                                onChange={(value) =>
                                  handleChange("country", value)
                                }
                                placeholder="Select a country"
                                style={{ width: "100%" }}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                  option.children
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                              >
                                {countryOptions.map((country) => (
                                  <Option
                                    key={country.value}
                                    value={country.value}
                                  >
                                    {country.label}
                                  </Option>
                                ))}
                              </Select>
                              {validationErrors.country && (
                                <span style={{ color: "red" }}>
                                  {validationErrors.country}
                                </span>
                              )}
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label={
                                <span>
                                  State / Province
                                  {/* <span className="required-asterisk">*</span> */}
                                </span>
                              }
                              name="state"
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter your state.",
                                },
                                {
                                  pattern: "^[a-zA-Z]+$",
                                  message:
                                    "Only letters (a-z, A-Z) are allowed.",
                                },
                              ]}
                              // required={false}
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                            >
                              <Input
                                type="text"
                                id="state"
                                name="state"
                                value={applicantData.state}
                                onChange={(e) =>
                                  handleChange("state", e.target.value)
                                }
                                placeholder="State"
                                style={{ width: "100%" }}
                              />
                              {validationErrors.firstName && (
                                <span style={{ color: "red" }}>
                                  {validationErrors.firstName}
                                </span>
                              )}
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label={
                                <span>
                                  City
                                  {/* <span className="required-asterisk">*</span> */}
                                </span>
                              }
                              name="city"
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter your city.",
                                },
                                {
                                  pattern: "^[a-zA-Z]+$",
                                  message:
                                    "Only letters (a-z, A-Z) are allowed.",
                                },
                              ]}
                              // required={false}
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                            >
                              <Input
                                type="text"
                                id="city"
                                name="city"
                                value={applicantData.city}
                                onChange={(e) =>
                                  handleChange("city", e.target.value)
                                }
                                placeholder="City"
                                style={{ width: "100%" }}
                              />
                              {validationErrors.firstName && (
                                <span style={{ color: "red" }}>
                                  {validationErrors.firstName}
                                </span>
                              )}
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label={
                                <span>
                                  Street
                                  {/* <span className="required-asterisk">*</span> */}
                                </span>
                              }
                              name="street"
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter your street.",
                                },
                              ]}
                              // required={false}
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                            >
                              <Input
                                type="text"
                                id="street"
                                name="street"
                                value={applicantData.street}
                                onChange={(e) =>
                                  handleChange("street", e.target.value)
                                }
                                placeholder="Street"
                                style={{ width: "100%" }}
                              />
                              {validationErrors.firstName && (
                                <span style={{ color: "red" }}>
                                  {validationErrors.firstName}
                                </span>
                              )}
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label={
                                <span>
                                  Postal Code
                                  {/* <span className="required-asterisk">*</span> */}
                                </span>
                              }
                              name="zip"
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter your postal code.",
                                },
                              ]}
                              // required={false}
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                            >
                              <Input
                                type="text"
                                id="zip"
                                name="zip"
                                value={applicantData.zip}
                                onChange={(e) =>
                                  handleChange("zip", e.target.value)
                                }
                                placeholder="Postal Code"
                                style={{ width: "100%" }}
                              />
                              {validationErrors.firstName && (
                                <span style={{ color: "red" }}>
                                  {validationErrors.firstName}
                                </span>
                              )}
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label={
                                <span>
                                  Permanent Address
                                  {/* // //   <span className="required-asterisk">*</span> */}
                                </span>
                              }
                              name="permanentAddress"
                              rules={[
                                {
                                  required: true,
                                  message:
                                    "Please enter your permanent address.",
                                },
                              ]}
                              // required={false}
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                            >
                              <Input
                                type="text"
                                id="permanentAddress"
                                name="permanentAddress"
                                value={applicantData.permanentAddress}
                                onChange={(e) =>
                                  handleChange(
                                    "permanentAddress",
                                    e.target.value
                                  )
                                }
                                placeholder="Permanent Address"
                                style={{ width: "100%" }}
                              />
                              {validationErrors.firstName && (
                                <span style={{ color: "red" }}>
                                  {validationErrors.firstName}
                                </span>
                              )}
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label={
                                <span>
                                  Residential Address
                                  {/* // //   <span className="required-asterisk">*</span> */}
                                </span>
                              }
                              name="residentialAddress"
                              rules={[
                                {
                                  required: true,
                                  message:
                                    "Please enter your residential address.",
                                },
                              ]}
                              // required={false}
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                            >
                              <Input
                                type="text"
                                id="residentialAddress"
                                name="residentialAddress"
                                value={applicantData.residentialAddress}
                                onChange={(e) =>
                                  handleChange(
                                    "residentialAddress",
                                    e.target.value
                                  )
                                }
                                placeholder="Residential Address"
                                style={{ width: "100%" }}
                              />
                              {validationErrors.firstName && (
                                <span style={{ color: "red" }}>
                                  {validationErrors.firstName}
                                </span>
                              )}
                            </Form.Item>
                          </Col>

                          <div
                            className="col-md-12"
                            style={{ textAlign: "right", marginTop: "20px" }}
                          >
                            {currentStep > 0 && (
                              <Button
                                type="button"
                                onClick={() => setCurrentStep(currentStep - 1)}
                                className="btn btn-secondary"
                              >
                                Back
                              </Button>
                            )}
                            {currentStep < stepTitles.length - 1 && (
                              <Button
                                type="submit"
                                onClick={handleSubmit}
                                className="btn btn-primary"
                              >
                                Next
                              </Button>
                            )}
                          </div>
                        </Row>
                      </div>
                    )}
                      </Form>
                    {currentStep === 1 && (
                      
                      <Job
                        handleNext={handleNext}
                        handleBack={handleBack}
                        currentStep={currentStep}
                        
                      />
                    )}
                    {currentStep === 2 && (
                      <APPQues
                        handleNext={handleNext}
                        handleBack={handleBack}
                        currentStep={currentStep}
                        formValues={formValues}
                      />
                    )}

                    {currentStep === 3 && (
                      <Ack
                        handleNext={handleNext}
                        handleNextStep={handleNextStep}
                        handleBack={handleBack}
                        currentStep={currentStep}
                        handleAcknowledgmentSubmit={handleAcknowledgmentSubmit}
                      />
                    )}
                
                </div>
                
              </MDBCol>
            </MDBRow>
          </MDBCard>
        </MDBContainer>
      </main>
    </div>
  );
};

export default ApplicantForm;
