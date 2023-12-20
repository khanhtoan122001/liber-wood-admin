// ** React Imports
import { useState, Fragment, useEffect } from 'react'

// ** Reactstrap Imports
import { Row, Col, Card, Form, CardBody, Button, Badge, Modal, Input, Label, ModalBody, ModalHeader, ListGroup, ListGroupItem } from 'reactstrap'

// ** Third Party Components
import Swal from 'sweetalert2'
import Select from 'react-select'
import { Check, Briefcase, X, FileText, DownloadCloud  } from 'react-feather'
import { useForm, Controller } from 'react-hook-form'
import withReactContent from 'sweetalert2-react-content'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import { selectThemeColors } from '@utils'

import { deleteProduct, updateProduct } from '../store'
import { getAllData, getCollection } from '../../collection/store'
import { useDispatch, useSelector } from 'react-redux'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import { useNavigate } from 'react-router-dom'

import { useDropzone } from 'react-dropzone'

const MySwal = withReactContent(Swal)

const CollectionCard = ({ selected }) => {
  // ** State
  const [show, setShow] = useState(false)
  const [files, setFiles] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(selected)
  const [selectOption, setSelectOption] = useState([])
  const [collection, setCollection] = useState("")
  const [thumb, setThumbnail] = useState()

  const store = useSelector(state => state.products)
  const store2 = useSelector(state => state.collections)

  const dispatch = useDispatch()

  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getAllData())
  }, [dispatch, store2.allData.length])

  useEffect(() => {
    setSelectedProduct(store.selectedProduct)
    dispatch(getCollection(store.selectedProduct.collectionId))
  }, [dispatch, store])

  useEffect(() => {
    setCollection(store2.selectedCollection?.name)
  }, [store2.selectedCollection])

  useEffect(() => {
    console.log(store2.allData)
    let data = []
    for (let i = 0; i < store2.allData.length; i++) {
      data = [...data, {value: store2.allData[i].id, label: store2.allData[i].name}]
    }
    setSelectOption(data)
  }, [store2])

  // ** Hook
  const {
    reset,
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: selectedProduct.name,
      description: selectedProduct.description,
      color: selectedProduct.color
    }
  })

  // ** render user img
  const renderCollectionImg = () => {
    if (selectedProduct !== null && selectedProduct.thumbnail) {
      return (
        <img
          height='117'
          width='208'
          alt='collection-thumbnail'
          src={selectedProduct.thumbnail}
          className='img-fluid rounded mt-3 mb-2'
        />
      )
    } else {
      return (
        null
      )
    }
  }

  const renderImage = () => {
    if (selectedProduct !== null && selectedProduct.image) {
      const array = selectedProduct.image.split(", ")
      const image = array.map(img => (
        <img
          height='59'
          width='104'
          alt='collection-thumbnail'
          src={img}
          className='img-fluid rounded mx-1'
        />
      ))
      return image
    } else {
      return (
        null
      )
    }
  }

  const onSubmit = data => {
    setShow(false)
    console.log(data)
    dispatch(updateProduct({
      id: selectedProduct.id, 
      product: {...data, image: files, thumbnail: thumb, collectionId: data.collectionId.value}
    }))
    if (Object.values(data).every(field => field?.length > 0)) {
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }

  const handleSuspendedClick = () => {
    return MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert it!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete product!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        dispatch(deleteProduct(selectedProduct.id)).then(() => {
          MySwal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Product has been deleted.',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          }).then(function (result) {
            if (result.value) {
              navigate("/apps/product/list")
            }
          })
        })
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
        MySwal.fire({
          title: 'Cancelled',
          text: 'Cancelled :)',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      }
    })
  }

  async function fetchThumbAsBlob() {
    const response = await fetch(selectedProduct.thumbnail)
    const blob = await response.blob()
    return blob
  }
  async function fetchImageAsBlob(url) {
    const response = await fetch(url)
    const blob = await response.blob()
    return blob
  }

  const handleReset = () => {
    fetchThumbAsBlob().then((e) => {
      setThumbnail([e])
    })
    reset({
      name: selectedProduct.name,
      description: selectedProduct.description,
      color: selectedProduct.color
    })
  }

  useEffect(() => {
    if (selectedProduct.thumbnail) {
      fetchThumbAsBlob().then((e) => {
        setThumbnail(e)
      })
    }
    const imageArray = selectedProduct.image.split(", ")
    const array = []
    imageArray.forEach(image => {
      fetchImageAsBlob(image).then((e) => {
        array.push(e)
      })
    })
    setFiles(array)
  }, [selectedProduct])

  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    onDrop: acceptedFiles => {
      setFiles([...files, ...acceptedFiles])
    }
  })

  const renderFilePreview = file => {
    if (file.type.startsWith('image')) {
      return <img className='rounded' alt={file.name} src={URL.createObjectURL(file)} height='28' width='28' />
    } else {
      return <FileText size='28' />
    }
  }

  const handleRemoveFile = file => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter(i => i.name !== file.name)
    setFiles([...filtered])
  }

  const renderFileSize = size => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`
    }
  }

  const fileList = files.map((file, index) => (
    <ListGroupItem key={`${file.name}-${index}`} className='d-flex align-items-center justify-content-between'>
      <div className='file-details d-flex align-items-center'>
        <div className='file-preview me-1'>{renderFilePreview(file)}</div>
        <div>
          <p className='file-name mb-0'>{file.name}</p>
          <p className='file-size mb-0'>{renderFileSize(file.size)}</p>
        </div>
      </div>
      <Button color='danger' outline size='sm' className='btn-icon' onClick={() => handleRemoveFile(file)}>
        <X size={14} />
      </Button>
    </ListGroupItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setThumbnail(file)
    // console.log('Thông tin về file: ', file)
  }

  return (
    <Fragment>
      <Card>
        <CardBody>
          <div className='user-avatar-section'>
            <div className='d-flex align-items-center flex-column'>
              {renderCollectionImg()}
              <div className='d-flex flex-column align-items-center text-center'>
                <div className='user-info'>
                  <h4>{selectedProduct !== null ? selectedProduct.name : ''}</h4>
                </div>
              </div>
            </div>
          </div>
          <h4 className='fw-bolder border-bottom pb-50 mb-1'>Details</h4>
          <div className='info-container'>
            {selectedProduct !== null ? (
              <ul className='list-unstyled'>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>Collection: </span>
                  <span>{collection}</span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>Color: </span>
                  <span>{selectedProduct.color}</span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>Description: </span>
                  <span>{selectedProduct.description}</span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>Image: </span>
                  <span>{renderImage()}</span>
                </li>
              </ul>
            ) : null}

          </div>
          <div className='d-flex justify-content-center pt-2'>
            <Button color='primary' onClick={() => setShow(true)}>
              Edit
            </Button>
            <Button className='ms-1' color='danger' outline onClick={handleSuspendedClick}>
              Delete
            </Button>
          </div>
        </CardBody>
      </Card>
      <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
        <ModalBody className='px-sm-5 pt-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Edit Product Information</h1>
          </div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className='gy-1 pt-75'>
              <Col md={6} xs={12}>
                <Label className='form-label' for='name'>
                  Name
                </Label>
                <Controller
                  defaultValue=''
                  control={control}
                  id='name'
                  name='name'
                  render={({ field }) => (
                    <Input {...field} id='name' placeholder='Winter' invalid={errors.name && true} />
                  )}
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='collectionId'>
                  Collection
                </Label>
                <Controller
                  defaultValue=''
                  control={control}
                  id='collectionId'
                  name='collectionId'
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      className='react-select'
                      classNamePrefix='select'
                      defaultValue={selectOption[0]}
                      options={selectOption}
                      isClearable={false}
                      {...field}
                    />
                  )}
                />
              </Col>
              <Col xs={12}>
                <Label className='form-label' for='color'>
                  Color
                </Label>
                <Controller
                  defaultValue=''
                  control={control}
                  id='color'
                  name='color'
                  render={({ field }) => (
                    <Input {...field} id='color' placeholder='' invalid={errors.color && true} />
                  )}
                />
              </Col>
              <Col xs={12}>
                <Label className='form-label' for='description'>
                  Description
                </Label>
                <Controller
                  defaultValue=''
                  control={control}
                  id='description'
                  name='description'
                  render={({ field }) => (
                    <Input {...field} id='description' type='textarea' placeholder='' invalid={errors.description && true} />
                  )}
                />
              </Col>
              <Col xs={12}>
                <Label className='form-label'>
                  Thumbnail
                </Label>
                <Input id='thumbnail' type='file' onChange={handleFileChange} />
              </Col>
              <Col xs={12}>
                <Label className='form-label'>
                  Image
                </Label>
                <div {...getRootProps({ className: 'dropzone' })}>
                  <input {...getInputProps()} />
                  <div className='d-flex align-items-center justify-content-center flex-column'>
                    <DownloadCloud size={64} />
                    <h5>Drop Files here or click to upload</h5>
                    <p className='text-secondary'>
                      Drop files here or click{' '}
                      <a href='/' onClick={e => e.preventDefault()}>
                        browse
                      </a>{' '}
                      thorough your machine
                    </p>
                  </div>
                </div>
                {files.length ? (
                  <Fragment>
                    <ListGroup className='my-2'>{fileList}</ListGroup>
                    <div className='d-flex justify-content-end'>
                      <Button type='button' className='me-1' color='danger' outline onClick={handleRemoveAllFiles}>
                        Remove All
                      </Button>
                    </div>
                  </Fragment>
                ) : null}
              </Col>
              <Col xs={12} className='text-center mt-2 pt-50'>
                <Button type='submit' className='me-1' color='primary'>
                  Submit
                </Button>
                <Button
                  type='reset'
                  color='secondary'
                  outline
                  onClick={() => {
                    handleReset()
                    setShow(false)
                  }}
                >
                  Discard
                </Button>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default CollectionCard
