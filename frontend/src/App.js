
import { Link,Routes,Route } from 'react-router-dom';
import './App.css';
import Countries from './Countries'
import Continents from './Continents'
import Continent from './Continent'
import Country from './Country'
import AddCountryForm from './AddCountryForm'

function App(){

return (<>
    
    <Routes> 
        <Route exact path='/'element={<>
        <Link to='/countries'>All Countries</Link>
        <Link to='/add'>Add Country</Link>
        <Continents/>
        </>
        } > 

        </Route>
        <Route path='/continent'element={<Continent/>} > 
        </Route>
        <Route path='/countries' element={<Countries/>}>
        </Route> 
        <Route path='/country' element={<Country/>}>
        </Route>
        <Route path='/add' element={<AddCountryForm/>}>
        </Route>
    
    </Routes>


</>
)
}

export default App;
