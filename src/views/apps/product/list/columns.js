// ** React Imports
import { Link } from 'react-router-dom'

// ** Store & Actions
import { store } from '@store/store'
import { deleteProduct } from '../store'

// import { apiEndpoint } from '../../../../@core/auth/jwt/jwtDefaultConfig'

// // ** Axios Imports
// import axios from 'axios'

// ** Icons Imports
import { Slack, User, Settings, Database, Edit2, MoreVertical, FileText, Trash2, Archive } from 'react-feather'

// ** Reactstrap Imports
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

// const renderCollection = async (id) => {
//   const response = await axios.get(`${apiEndpoint}/api/collections/${id}`)
//   console.log(response)
//   return ""
// }

// const renderColor = (color) => {
//   const separatedStrings = color.split(',');
//   for (let i = 0; i++; i < separatedStrings.length()) {

//   }
// }

export const columns = [
  {
    name: 'Name',
    sortable: false,
    minWidth: '300px',
    sortField: 'name',
    selector: row => row.name,
    cell: row => <span className='text-capitalize'>{row.name}</span>
  },
  {
    name: 'Description',
    sortable: false,
    minWidth: '172px',
    sortField: 'description',
    selector: row => row.description,
    cell: row => <span className='text-capitalize'>{row.description}</span>
  },
  {
    name: 'Collection ID',
    sortable: false,
    minWidth: '172px',
    sortField: 'collectionId',
    selector: row => row.collectionId,
    cell: row => <span className='text-capitalize'>{row.collectionId}</span>
  },
  {
    name: 'Color',
    sortable: false,
    minWidth: '172px',
    sortField: 'color',
    selector: row => row.color,
    cell: row => <span>{row.color}</span>
  },
  {
    name: 'Actions',
    minWidth: '100px',
    cell: row => (
      <div className='column-action'>
        <UncontrolledDropdown>
          <DropdownToggle tag='div' className='btn btn-sm'>
            <MoreVertical size={14} className='cursor-pointer' />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              tag={Link}
              className='w-100'
              to={`/apps/product/view/${row.id}`}
              onClick={() => store.dispatch(getProduct(row.id))}
            >
              <FileText size={14} className='me-50' />
              <span className='align-middle'>Details</span>
            </DropdownItem>
            <DropdownItem tag='a' href='/' className='w-100' onClick={e => e.preventDefault()}>
              <Archive size={14} className='me-50' />
              <span className='align-middle'>Edit</span>
            </DropdownItem>
            <DropdownItem
              tag='a'
              href='/'
              className='w-100'
              onClick={e => {
                e.preventDefault()
                store.dispatch(deleteProduct(row.id))
              }}
            >
              <Trash2 size={14} className='me-50' />
              <span className='align-middle'>Delete</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    )
  }
]
