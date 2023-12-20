// ** React Imports
import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

// ** Store & Actions
import { getProduct } from '../store'
import { useSelector, useDispatch } from 'react-redux'

// ** Reactstrap Imports
import { Row, Col, Alert } from 'reactstrap'

// ** User View Components
// import UserTabs from './Tabs'
// import PlanCard from './PlanCard'
import CollectionCard from './InfoCard'

// ** Styles
import '@styles/react/apps/app-users.scss'

const CollectionView = () => {
    // ** Store Vars
    const store = useSelector(state => state.products)
    const dispatch = useDispatch()
  
    // ** Hooks
    const { id } = useParams()
  
    // ** Get collection on mount
    useEffect(() => {
      dispatch(getProduct(parseInt(id)))
    }, [dispatch])

    return store.selectedProduct !== null && store.selectedProduct !== undefined ? (
      <div className='app-user-view'>
        <Row>
          <Col xl='4' lg='5' xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
            <CollectionCard selected={store.selectedProduct} />
            {/* <PlanCard /> */}
          </Col>
          <Col xl='8' lg='7' xs={{ order: 0 }} md={{ order: 1, size: 7 }}>
            {/* <UserTabs active={active} toggleTab={toggleTab} /> */}
          </Col>
        </Row>
      </div>
    ) : (
      <Alert color='danger'>
        <h4 className='alert-heading'>Collection not found</h4>
        <div className='alert-body'>
            Collection with id: {id} doesn't exist. Check list of all Collection: <Link to='/apps/collection/list'>Collection List</Link>
        </div>
      </Alert>
    )
  }
  export default CollectionView