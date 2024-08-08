import React, { useState, useEffect } from "react"
import "../css/Dashboard.css"
import axios from "axios"
import { Select } from "antd"
import customLogo from "../../Component/mainlogo.png"
import "react-circular-progressbar/dist/styles.css"

import { NavLink } from "react-router-dom"

function Approve() {
  const { Option } = Select
  const [resumeData, setResumeData] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All Resume")
  const filteredResumes =
    selectedCategory === "All Resume"
      ? resumeData
      : resumeData.filter((resume) => {
          const position = resume.fileUploadResponses.$values[0]?.positionId

          switch (selectedCategory) {
            case "UI/UXDesigner":
              return position === 3
            case "Frontend-Developer":
              return position === 1
            case "QualityAssurance":
              return position === 5

            case "FullStackDeveloper":
              return position === 4
            default:
              return true
          }
        })
  const [acceptData, setaceepttdata] = useState({
    subject: "Job Selection",
    content: "You are selected for the job",
  })
  const handleAccept = async (id) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/Account/send-message/${id}`,
        acceptData
      )

      setaceepttdata()
      alert("Message sent successfully!")
      window.location.reload()
    } catch (error) {
      console.error("Error rejecting resume:", error)
    }
  }
  const API_BASE_URL = "https://recruitmentapi.iykons.com"

  useEffect(() => {
    fetchResumeData3()
  }, [])

  const fetchResumeData3 = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/User/APROVE`)
      setResumeData(response.data.$values)
    } catch (error) {
      console.error("Error fetching resume data:", error)
    }
  }
  const categoryDropDownList = [
    { label: "All", value: "All Resume" },
    { label: "UI/UXDesigner", value: "UI/UXDesigner" },
    { label: "Frontend-Developer", value: "Frontend-Developer" },
    { label: "QualityAssurance", value: "QualityAssurance" },
    { label: "FullStackDeveloper", value: "FullStackDeveloper" },
  ]
  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <link
        href="https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css"
        rel="stylesheet"
      />

      <link rel="stylesheet" href="style.css" />
      <title>JobAdmin</title>

      <section id="sidebar">
        <a href="/dashboard" className="brand">
          <i className="bx bxs-smile" />
          <span className="text">JobAdmin</span>
        </a>
        <ul className="side-menu top">
          <li className="active">
            <a href="/dashboard">
              <i className="bx bxs-dashboard" />
              <span className="text">Dashboard</span>
            </a>
          </li>
        </ul>

        <ul className="side-menu">
          <li>
            <NavLink to="/all">
              <span className="text">All Resume</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/new">
              <span className="text">New Resume</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/accept">
              <span className="text">Accept Resume</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/approve">
              <span className="text">Approved Resume</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/reject">
              <span className="text">Reject Resume</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/manage">
              <span className="text">Manage Users</span>
            </NavLink>
          </li>
        </ul>
      </section>

      <section id="content">
        <nav>
          <form action="#"></form>

          <a href="/dashboard" className="profile">
            <img src={customLogo} alt="Custom Logo" />
          </a>
        </nav>

        <main>
          <div className="head-title">
            <div className="left">
              <h1>Dashboard</h1>
              <ul className="breadcrumb">
                <li>
                  <a href="/dashboard">Dashboard</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right" />
                </li>
                <li>Approved Resumes</li>
              </ul>
            </div>
          </div>

          <div className="table-data">
            <div className="order">
              <div className="head">
                <h3>Resumes</h3>
                <Select
                  className="nav-link"
                  style={{ width: 200 }}
                  onChange={(value) => setSelectedCategory(value)}
                  defaultValue="All Resume"
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {categoryDropDownList.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Resume</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResumes.map((resume) => (
                    <tr key={resume.id}>
                      <td>
                        {resume.firstName} {resume.lastName}
                      </td>
                      <td>
                        {resume.fileUploadResponses.$values.map((file) => (
                          <div key={file.id}>
                            <a
                              href={file.filePath}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Resume
                            </a>
                          </div>
                        ))}
                      </td>

                      <td>
                        <button
                          onClick={() => handleAccept(resume.id)}
                          style={{
                            padding: "5px 10px",
                            fontSize: "14px",
                            color: "white",
                            marginRight: "5px",
                            backgroundColor: "#3C91E6",

                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.backgroundColor = "green")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.backgroundColor = "#3C91E6")
                          }
                        >
                          SendMail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </section>
    </>
  )
}

export default Approve
