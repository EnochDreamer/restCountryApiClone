import Continent from './Continent';
import Country from './Country'
import Page from './Page';
import Header from './Header'

import './styles/countries.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
function Countries() {
    // {countries,page,totalCountries,prevPagefunc,nextPagefunc}

    const [page, setPage] = useState(1)
    const [continentId, setContinentId] = useState(0)
    const [continents, setContinents] = useState([])
    const [countries, setCountries] = useState([])
    const [totalCountries, setTotalCountries] = useState(0)
    const [flashMessage, setFlashMessage] = useState('')
    const [user, setUser] = useState({})
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()

    function prevPagefunc() {
        setPage((prevpage) => (prevpage - 1))
    }
    function nextPagefunc() {
        setPage((prevpage) => (prevpage + 1))
    }
    function handleContinent(id) {
        setContinentId(id)
        setPage(1)
    }
    function logout() {
        fetch('/log-out')
        setUser({})
    }



    useEffect(() => {
        fetch(`/continents/${continentId}?page=${page}&search_term=${searchTerm}&flashMessage=${flashMessage}`)
            .then((res) => res.json())
            .then((data) => {
                setFlashMessage(data.flash_message)
                if (data.error) {
                    setFlashMessage(data.flash_message)
                }
                else {
                    setCountries(data.countries)
                    setTotalCountries(data.total_countries)
                    setContinents(data.continents)
                    setUser(data.user)
                }
            })


    }
        , [page, continentId, searchTerm,flashMessage])

    function handleDel(id) {
        fetch(`/countries/${id}`, {
            method: 'DELETE'
        })
            .then((res) => (res.json()))
            .then((data) => {
                setFlashMessage(data.flash_message)
                if (data.error) {
                    if (data.error === 401) {
                        navigate('/login')
                    }
                    else{
                        setFlashMessage(data.flash_message)
                    }
                        
                    
                }
                else {
                    setCountries((prevCountries) => prevCountries.filter(country => (country.id !== data.deleted)))
                }

            })
    }



    console.log(flashMessage)
    return (
        <>
            <Header
                user={user}
                continents={continents}
                logout={logout}
                setSearchTerm={setSearchTerm}
                searchTerm={searchTerm}
                setPage={setPage}
                setFlashMessage={setFlashMessage}
            />
            <div className='countries-pane'>
                <strong className='error'>{flashMessage}</strong>
                <div className='Countries-container'>
                    {countries.map(country => {
                        return (<Country
                            key={country.id}
                            country={country}
                            setFlashMessage={setFlashMessage}
                            continents={continents}
                            handleDel={handleDel}
                            user={user}
                        />)
                    })}


                </div>
                <Page
                    totalCountries={totalCountries}
                    page={page}
                    prevPagefunc={prevPagefunc}
                    nextPagefunc={nextPagefunc}
                />
            </div>




            <ul className='continents-container'>
                <li onClick={() => handleContinent(0)} >View all</li>
                {continents.map(continent => {
                    return (<Continent
                        key={continent.id}
                        handleContinent={handleContinent}
                        {...continent}
                    />)
                })}
            </ul>
        </>
    );

}
export default Countries;