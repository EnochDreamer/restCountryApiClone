import {useState} from 'react' 
function AddCountryForm() {

    const [formInput,setFormInput]=useState({
        name:'',
        population:'',
        currency:'',
        cca3:'',
        official_language:'',
        continent:''
    })
    function handleForm(e){
        const {name,value}=e.target
        setFormInput((prevInput)=>{
            return  {...prevInput,
            [name]:value
            }
        })}
    
    function handleSubmit(e){
        e.preventDefault()
            fetch('/countries', {
                method: 'POST',
                body: JSON.stringify(formInput),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
          setFormInput({
            name:'',
            population:'',
            currency:'',
            cca3:'',
            official_language:'',
            continent:''
        })  
    }

    return ( <>
        <form onSubmit={handleSubmit}>
            <input 
            placeholder='Enter Name'
            type='text' 
            name='name'
            value={formInput.name}
            onChange={handleForm}
            />
            <input 
            placeholder='Enter Population'
            type='text' 
            name='population'
            value={formInput.population}
            onChange={handleForm}
            />
            <input 
            placeholder='Enter Currency'
            type='text' 
            name='currency'
            value={formInput.currency}
            onChange={handleForm}
            />
            <input 
            placeholder='Enter cca3'
            type='text' 
            name='cca3'
            value={formInput.cca3}
            onChange={handleForm}
            />
            <input 
            placeholder='Enter Language'
            type='text' 
            name='official_language'
            value={formInput.official_language}
            onChange={handleForm}
            
            />
            <select
            name='continent'
            value={formInput.continent}
            onChange={handleForm}
            >
                <option value=''>--select--</option>
                <option value={1}>Africa</option>
                <option value={2}>Asia</option>
                <option value={3}>Europe</option>
            </select>
            <button>Submit</button>
        </form>
    </> );
}

export default AddCountryForm;