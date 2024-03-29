import { useState } from 'react'
import { Link ,useLocation } from 'react-router-dom'
import './styles/addCountryForm.css'
function AddCountryForm() {
    const [error,setError]=useState('')
    const location=useLocation()
    const {continents}=location.state
    const {setFlashMessage}=location.data
    console.log(continents)

    const [formInput, setFormInput] = useState({
        name: '',
        population: '',
        currency: '',
        cca3: '',
        official_language: '',
        continent: ''
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
        fetch('/countries', {
            method: 'POST',
            body: JSON.stringify(formInput),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res)=>res.json())
        .then((data)=>{
            console.log(data)
            setFlashMessage(data.flash_message)
        })
        
        setFormInput({
            name: '',
            population: '',
            currency: '',
            cca3: '',
            official_language: '',
            continent: ''
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
                    name='name'
                    value={formInput.name}
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
                    name='continent'
                    value={formInput.continent}
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

export default AddCountryForm;