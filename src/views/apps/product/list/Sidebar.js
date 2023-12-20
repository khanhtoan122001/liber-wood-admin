// ** React Import
import { useState, Fragment, useEffect } from 'react'

// ** Custom Components
import Sidebar from '@components/sidebar'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Third Party Components
import Select from 'react-select'
// import classnames from 'classnames'
import { useForm, Controller } from 'react-hook-form'

// ** Reactstrap Imports
import { Button, Label, FormText, Form, Input, ListGroup, ListGroupItem } from 'reactstrap'

// ** Store & Actions
import { addProduct } from '../store'
import { getAllData } from '../../collection/store'
import { useDispatch, useSelector } from 'react-redux'

import { useDropzone } from 'react-dropzone'
import { FileText, X, DownloadCloud } from 'react-feather'

const defaultValues = {
  name: '',
  description: ''
}

const checkIsValid = data => {
  return Object.values(data).every(field => (typeof field === 'object' ? field !== null : field?.length > 0))
}

const SidebarNewCollections = ({ open, toggleSidebar }) => {
  // ** States
  // const [data, setData] = useState(null)
  // const [plan, setPlan] = useState('basic')
  // const [role, setRole] = useState('subscriber')
  const [thumb, setThumbnail] = useState()
  const [files, setFiles] = useState([])
  const [selectOption, setSelectOption] = useState([])
  // const [selectedFile, setSelectedFile] = useState([])

  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.collections)

  
  useEffect(() => {
    dispatch(getAllData())
  }, [dispatch, store.allData.length])

  useEffect(() => {
    console.log(store.allData)
    let data = []
    for (let i = 0; i < store.allData.length; i++) {
      data = [...data, {value: store.allData[i].id, label: store.allData[i].name}]
    }
    setSelectOption(data)
  }, [store])

  // ** Vars
  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  // ** Function to handle form submit
  const onSubmit = data => {
    // setData(data)
    if (checkIsValid(data)) {
      toggleSidebar()
      console.log(data)
      dispatch(
        addProduct({
          ...data,
          thumbnail: thumb,
          image: files,
          collectionId: data.collectionId.value
        })
      )
    } else {
      for (const key in data) {
        if (data[key] === null) {
          setError('country', {
            type: 'manual'
          })
        }
        if (data[key] !== null && data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }

  const handleSidebarClosed = () => {
    for (const key in defaultValues) {
      setValue(key, '')
    }
  }

  
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
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
    <Sidebar
      size='lg'
      open={open}
      title='New Collection'
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-1'>
          <Label className='form-label' for='name'>
            Name <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <Input id='name' placeholder='Winter' invalid={errors.name && true} {...field} />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='description'>
            Description
          </Label>
          <Controller
            name='description'
            control={control}
            render={({ field }) => (
              <Input id='description' placeholder='' invalid={errors.description && true} {...field} />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='thumbnail'>
            Thumbnail
          </Label>
          <Input id='thumbnail' type='file' onChange={handleFileChange} />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='collectionId'>
            Collection
          </Label>
          <Controller
            name='collectionId'
            control={control}
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
          
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='color'>
            Color
          </Label>
          <Controller
            name='color'
            control={control}
            render={({ field }) => (
              <Input id='color' placeholder='' invalid={errors.color && true} {...field} />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='thumbnail'>
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
        </div>
        <Button type='submit' className='me-1' color='primary'>
          Submit
        </Button>
        <Button type='reset' color='secondary' outline onClick={toggleSidebar}>
          Cancel
        </Button>
      </Form>
    </Sidebar>
  )
}

export default SidebarNewCollections
