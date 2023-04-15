import { useState } from 'react'
import { Link ,useLocation, useNavigate } from 'react-router-dom'
import './styles/addCountryForm.css'

function EditCountryForm() {
    const [error,setError]=useState('')
    const location=useLocation()
    const {continents,country}=location.state
    const {setFlashMessage}=location.data
    const navigate=useNavigate()
    console.log(continents)

    const [formInput, setFormInput] = useState({
        common_name: country.common_name,
        population: country.population,
        currency: country.currency,
        cca3: country.cca3,
        official_language: country.official_language,
        continent_id: country.continent_id
    })
    function handleForm(e) {
        const { name, value } = e.target
        setFormInput((prevInput) => {
            return {
                ...prevInput,
                [name]: value
            }
        })
    }

    function handleSubmit(e) {
        e.preventDefault()
        fetch(`/countries/${country.id}`, {
            method: 'PUT',
            body: JSON.stringify(formInput),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res)=>res.json())
        .then((data)=>{
            console.log(data)
            setFlashMessage(data.setFlashMessage)
           data.success && navigate('/')
        })
        
        
       
    }

    return (
        <div className='form-container'>
            
            <Link to='/'>
                <button  className='close-icon' aria-hidden='true' >&times;</button>
            </Link> 
            
            <form onSubmit={handleSubmit}>
                <label  htmlFor='name' >Enter Name</label>
                <input
                    id='name'
                    placeholder='Enter Name'
                    type='text'
                    name='common_name'
                    value={formInput.common_name}
                    onChange={handleForm}
                    required
                />
                <label  htmlFor='population' >Enter Population</label>
                <input
                    id='population'
                    placeholder='Enter Population'
                    type='text'
                    name='population'
                    value={formInput.population}
                    onChange={handleForm}
                    required
                />
                <label  htmlFor='currency' >Enter Currency</label>
                <input
                    id='currency'
                    placeholder='Enter Currency'
                    type='text'
                    name='currency'
                    value={formInput.currency}
                    onChange={handleForm}
                    required
                />
                <label  htmlFor='cca3' >Enter cca3</label>
                <input
                    id='cca3'
                    placeholder='Enter cca3'
                    type='text'
                    name='cca3'
                    value={formInput.cca3}
                    onChange={handleForm}
                    required
                />
                <label  htmlFor='official_language' >Enter official Language</label>
                <input
                    id='official_language'
                    placeholder='Enter Language'
                    type='text'
                    name='official_language'
                    value={formInput.official_language}
                    onChange={handleForm}
                    required

                />
                <label  htmlFor='continent'>select Continent</label>
                <select
                    id='continent'
                    name='continent_id'
                    value={formInput.continent_id}
                    onChange={handleForm}
                    required
                >
                    <option value=''>--select--</option>
                    {continents.map((continent)=>{
                        return(
                            <option key={continent.id} value={continent.id}>{continent.name}</option>
                        )})}
                </select>
                <button>Submit</button>
                <strong className='error' >{error}</strong>
            </form>
        </div>);
}

export default EditCountryForm;