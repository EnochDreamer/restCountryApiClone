import './App.css';
import Countries from './Countries'
import AddCountryForm from './AddCountryForm'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import EditCountryForm from './EditCountryForm'
import { Routes,Route } from 'react-router-dom';
// import ContinentList from './ContinentList'

function App() {

    // const [countries, setCountries] = useState([])
    // const [page, setPage] = useState(1)
    // const [totalCountries, setTotalCountries] = useState(1)
    // const [show, setShow] = useState(false)
    // function handleShow() {
    //     setShow((prevShow) => !prevShow)
    // }


    


    
    return (<>
        
        <Routes>
            <Route path='/' exact element={
            <Countries/>
            } >
            </Route>
            <Route path='/add' element={<AddCountryForm />}>
            </Route>
            <Route path='/login' element={<LoginForm />}>
            </Route>
            <Route path='/sign-up' element={<SignupForm />}>
            </Route>
            <Route path='/edit' element={<EditCountryForm />}>
            </Route>
        </Routes>
    </>)
}

export default App;
