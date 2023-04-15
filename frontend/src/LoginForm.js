import { useState } from 'react'
import './styles/addCountryForm.css'
import {Link, useNavigate} from 'react-router-dom'

function LoginForm() {
    const [error,setError]=useState('')
    const [formInput, setFormInput] = useState({
        username: '',
        email: '',
        password: ''
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


    const navigate=useNavigate()

    function handleSubmit(e) {
        e.preventDefault()
        fetch('/login', {
            method: 'POST',
            body: JSON.stringify(formInput),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                if (data.success){
                    navigate('/')
                }
                setError(data.error + ' ' + data.ErrorMessage)
            })

        setFormInput({
            username: '',
            email: '',
            password: ''
        })
    }
    return (
        <div className='form-container'>

            <Link to='/'>
                <button className='close-icon' aria-hidden='true' >&times;</button>
            </Link>
            <form onSubmit={handleSubmit}>
                {/* <label htmlFor='user_name' >Enter username</label>
                <input
                    id='user_name'
                    placeholder='Enter username'
                    type='text'
                    name='user_name'
                    value={formInput.user_name}
                    onChange={handleForm}
                    required
                /> */}
                <label htmlFor='email' >Enter email</label>
                <input
                    id='email'
                    placeholder='Enter email'
                    type='email'
                    name='email'
                    value={formInput.email}
                    onChange={handleForm}
                    required
                />
                <label htmlFor='currency' >Enter password</label>
                <input
                    id='password'
                    placeholder='Enter password'
                    type='password'
                    name='password'
                    value={formInput.password}
                    onChange={handleForm}
                    required
                />
                <button>Submit</button>
                <strong className='error' >{error}</strong>
            </form>
        </div>
            );
}

            export default LoginForm;