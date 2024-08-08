import React, { useState } from 'react'
import { Button, Upload, Spin, Image, Card, Tooltip } from 'antd'
import { uploadFileToS3 } from '../config/AwsConfig'
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { ReactComponent as PDFImage } from '../assets/Svg/Pdf.svg'
import { ReactComponent as ExcelImage } from '../assets/Svg/excel.svg'


const S3Upload = (props) => {
  const { name, setFormData, dynamicPath } = props
  const [uploadedFileUrl, setUploadedFileUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleBeforeUpload = () => false

  const getFileExtension = (url) => {
    return url ? url.split('.').pop().toLowerCase() : undefined
  }

  const fileOnChange = async (file, name) => {
    setIsLoading(true)
    try {
      const response = await uploadFileToS3(file, dynamicPath)
      const { Location } = response
      if (Location) {
        setFormData(name, Location)
        setUploadedFileUrl(Location)
      }
      setIsLoading(false)
    } catch (error) {
      console.error("Error uploading file to S3:", error)
      setIsLoading(false)
    }
  }

  const handleRemove = () => {
    setFormData(name, "")
    setUploadedFileUrl("")
  }

  const handleDownload = (url) => {
    const link = document.createElement('a')
    link.href = url
    link.download = url.split('/').pop() || 'document'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const fileExtension = getFileExtension(uploadedFileUrl)

  return (
    <Upload
      accept=".png,.jpeg,.jpg,.pdf,.doc,.xlsx,.csv"
      beforeUpload={handleBeforeUpload}
      onChange={(info) => {
        const isAllowedFileType = ["application/pdf", "image/jpeg", "image/png", "image/jpg"].includes(info.file.type)
        if (!isAllowedFileType) {
        
          return Upload.LIST_IGNORE
        }
        fileOnChange(info.file, name)
        return false
      }}
      maxCount={1}
      showUploadList={{
        showRemoveIcon: false,
        showPreviewIcon: false,
      }}
      defaultFileList={[]}
    >
      <Button>Choose File</Button>
      {isLoading && <Spin />}
      {uploadedFileUrl && (
        <Card
          style={{ width: 200, marginTop: 16 }}
          cover={
            fileExtension === 'pdf' ? (
              <PDFImage width={200} height={200} style={{ cursor: 'pointer' }} />
            ) : fileExtension === 'xlsx' || fileExtension === 'csv' ? (
              <ExcelImage width={200} height={200} style={{ cursor: 'pointer' }} />
            ) : (
              <Image width={200} height={200} src={uploadedFileUrl} />
            )
          }
          actions={[
            <DeleteOutlined key="delete" onClick={handleRemove} />,
            <Tooltip key="view" title="View and Download">
              <EyeOutlined onClick={() => handleDownload(uploadedFileUrl)} />
            </Tooltip>
          ]}
        />
      )}
    </Upload>
  )
}

export default S3Upload
