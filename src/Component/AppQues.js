import React, { useState, useEffect } from "react";
import axios from "axios";
import S3Upload from "./S3Upload";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Component/css/Applicant.css";
import {
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
import moment from "moment";

const API_BASE_URL = "https://recruitmentapi.iykons.com";

const { Option } = Select;

const AppQues = ({ handleNext, handleBack, currentStep }) => {
  const [formData, setFormData] = useState({
    uploadedFile: "",
  });
  const dynamicPath = `users/files`;
  const [form] = Form.useForm();
  const [appqueData, setappQudata] = useState({
    desiredLocation: "",
    isFullTimePosition: true,
    startDate: "22/09/2023",
    source: "",
    preferredContactMethod: "",
  });
  const [positionUserDTO, setDepartmentUserDTO] = useState({
    id: "",
  });

  const [app1queData, setappQudata1] = useState({
    refereename: "",
    refereephoneNo: "",
    refereeAddress: "",
  });

  const location = useLocation();
  const jwtToken = location.state ? location.state.token : null;

  const [selectedDate1, setSelectedDate1] = useState(null);

  const handleDateChange1 = (date1) => {
    setSelectedDate1(date1);
  };
  const handleAppqueDataChange = (field, value) => {
    setappQudata({
      ...appqueData,
      [field]: value,
    });
  };

  const handleApp1queDataChange = (field, value) => {
    setappQudata1({
      ...app1queData,
      [field]: value,
    });
  };

  const handleChangeDepartment = (value) => {
    // Find the selected position by its name
    const selectedPosition = departmentOptions.find(
      (position) => position.positionName === value
    );

    // If a position is found, set its id in the state
    if (selectedPosition) {
      setDepartmentUserDTO({
        id: selectedPosition.id,
      });
    }
  };

  const [departmentOptions, setDepartmentOptions] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/Position`);
        const positionData = response.data.$values;
        console.log(positionData);
        if (Array.isArray(positionData)) {
          setDepartmentOptions(positionData);
        } else {
          console.error(
            "Error fetching departments: Response data is not an array",
            response
          );
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const handleSubmit4 = async (e) => {
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
      console.log("Submitting form with data:", {
        ...appqueData,
        startDate: selectedDate1,
      });
  
      console.log("Uploaded CV file:", formData.uploadedFile);
  
      await axios.post(
        `${API_BASE_URL}/api/JobApplication/Job`,
        {
          ...appqueData,
          startDate: selectedDate1,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
  
      const fileData = {
        fileName: formData.uploadedFile.name,
        filePath: formData.uploadedFile,
        fileSize: 0,
        contentType: formData.uploadedFile.type,
        status: true,
        positionId: positionUserDTO.id,
      };
  
      await axios.post(
        `${API_BASE_URL}/api/FileUploadResponse/upload`,
        fileData,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
  
      handleNext();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  const stepTitles = [
    "Personal Details",
    "Experience Details",
    "Application Questions",
    "Acknowledgement",
    "Reviews",
  ];

  const disabledDate = (current) => {
    // Can not select days before today
    return current && current < moment().startOf("day");
  };
  const customizeRequiredMark = (label, required) => (
    <>
      {label}
      {required && <span style={{ color: "red" }}>*</span>}
    </>
  );
  return (
    <Form
    form={form}
    requiredMark={(label, { required }) =>
      customizeRequiredMark(label, required)
    }
  >
      <div className="container" style={{ marginTop: "60px" }}>
        <Row gutter={[24, 16]}>
          <Col span={12}>
            <Form.Item
              label={
                <span>
                  Referee Name
                  
                </span>
              }
              name="refereename"
              rules={[
                {required: true,
                  message: "Please enter the referee name.",
                },
                {
                  pattern: /^[a-zA-Z\s]+$/,
                  message: "Only letters and spaces are allowed.",
                },
              ]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input
                type="text"
                value={app1queData.refereename}
                onChange={(e) =>
                  handleApp1queDataChange("refereename", e.target.value)
                }
                placeholder="Referee name"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <span>
                  Referee Phone No
                  
                </span>
              }
              name="refereephoneNo"
              rules={[
                {
                  required: true,
                  message: "Please enter the referee phone no.",
                },
                {
                  pattern: /^\+\d{11,15}$/,
                  message:
                    "Phone number must be valid.",
                },
              ]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input
                type="tel"
                value={app1queData.refereephoneNo}
                onChange={(e) =>
                  handleApp1queDataChange("refereephoneNo", e.target.value)
                }
                placeholder="E.g. +94771473328"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={
                <span>
                  Referee Address
                  
                </span>
              }
              name="refereeAddress"
              rules={[
                {
                  required: true,
                  message: "Please enter the referee address.",
                },
              ]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input
                type="text"
                value={app1queData.refereeAddress}
                onChange={(e) =>
                  handleApp1queDataChange("refereeAddress", e.target.value)
                }
                placeholder="Referee Address"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
          <Form.Item
  label={
    <span>
      Desired Location
      
    </span>
  }
  name="desiredLocation"
  rules={[
    {
      required: true,
      message: "Please select the desired location.",
    },
  ]}
  labelCol={{ span: 24 }}
  wrapperCol={{ span: 24 }}
>
  <Select
    value={appqueData.desiredLocation}
    onChange={(value) =>
      handleAppqueDataChange("desiredLocation", value)
    }
    placeholder="Desired Location"
    showSearch
    optionFilterProp="children"
    filterOption={(input, option) =>
      option.children.toLowerCase().includes(input.toLowerCase())
    }
  >
    <Option value="OnSite">OnSite</Option>
    <Option value="Remote">Remote</Option>
  </Select>
</Form.Item>

          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <span>
                  Where did you hear this opportunity?
                  
                </span>
              }
              name="source"
              rules={[
                {
                  message: "Please select an option.",
                  required: true,
                },
              ]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Select
                value={appqueData.source}
                onChange={(value) => handleAppqueDataChange("source", value)}
                placeholder="Where did you hear this opportunity?"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                <Option value="LinkedIn">LinkedIn</Option>
                <Option value="Instagram">Instagram</Option>
                <Option value="IykonsWebsite">IykonsWebsite</Option>
                <Option value="Others">Others</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
  <Form.Item
    label={
      <span>
        Are you looking for a full-time position?
        
      </span>
    }
    name="isFullTimePosition"
    rules={[
      {
        required: true,
        message: "Please select an option.",
      },
    ]}
    labelCol={{ span: 24 }}
    wrapperCol={{ span: 24 }}
  >
    <Radio.Group
      onChange={(e) =>
        handleAppqueDataChange("isFullTimePosition", e.target.value)
      }
      value={appqueData.isFullTimePosition}
    >
      <Radio value={true}>Yes</Radio>
      <Radio value={false}>No</Radio>
    </Radio.Group>
  </Form.Item>
</Col>

          <Col span={12}>
          <Form.Item
  label={
    <span>
      When can you start?
      
    </span>
  }
  name="startDate"
  rules={[
    {
      required: true,
      message: "Please select a start date.",
    },
  ]}
  labelCol={{ span: 24 }}
  wrapperCol={{ span: 24 }}
>
  <DatePicker
    value={selectedDate1}
    onChange={handleDateChange1}
    format="DD/MM/YYYY"
    disabledDate={disabledDate}
    placeholder="When can you start?"
    style={{ width: "100%" }}
  />
</Form.Item>

          </Col>

          <Col span={12}>
            <Form.Item
              label={
                <span>
                  What is your preferred method of contact?
                  
                </span>
              }
              name="preferredContactMethod"
              rules={[
                {
                  required: true,
                  message: "Please select your preferred method of contact.",
                },
              ]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Select
                value={appqueData.preferredContactMethod}
                onChange={(value) =>
                  handleAppqueDataChange("preferredContactMethod", value)
                }
                placeholder="Preferred method of contact"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                <Option value="Phone">Phone</Option>
                <Option value="Email">Email</Option>
                <Option value="Facebook">Facebook</Option>
                <Option value="LinkedIn">LinkedIn</Option>
              </Select>
            </Form.Item>
          </Col>

         
          <Col span={12}>
            <Form.Item
              label={
                <span>
                  Category
                  
                </span>
              }
              name="positionName"
              rules={[
                {
                  required: true,
                  message: "Please select a category.",
                },
              ]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Select
                value={positionUserDTO.id}
                onChange={(value) => handleChangeDepartment(value)}
                placeholder="Category"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {departmentOptions.map((position) => (
                  <Option key={position.id} value={position.positionName}>
                    {position.positionName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
          <Form.Item
  label={<span>Upload CV</span>}
  name="uploadedFile"
  rules={[
    {
      required: true,
      message: "Please upload your CV file.",
    },
  ]}
  labelCol={{ span: 24 }}
  wrapperCol={{ span: 24 }}
>
  <S3Upload
    name="uploadedFile"
    setFormData={(name, value) => {
      setFormData({ ...formData, [name]: value });
      form.setFieldsValue({ uploadedFile: value }); // Update form value
    }}
    dynamicPath={dynamicPath}
  />
</Form.Item>

          </Col>
        </Row>
      </div>

      <div
        className="col-md-12"
        style={{ textAlign: "right", marginTop: "20px" }}
      >
        <Button
          className="custom-button"
          variant="contained"
          color="primary"
          onClick={handleBack}
          style={{ marginRight: "10px" }}
        >
          Back
        </Button>

        <Button
          type="primary"
          className="custom-button"
          onClick={handleSubmit4}
        >
          {currentStep === stepTitles.length - 1 ? "Finish" : "Next"}
        </Button>
      </div>
    </Form>
  );
};

export default AppQues;
