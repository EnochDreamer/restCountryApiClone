import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Page from './Page'
import { Link} from 'react-router-dom'


function Continent() {

    const [totalCountries, setTotalCountries] = useState(1)
    const [countries, setCountries] = useState([])
    const [page, setPage] = useState(1)

    function nextPagefunc() {
        setPage((prevPage) => (prevPage + 1))
    }

    function prevPagefunc() {
        setPage((prevPage) => (prevPage - 1))
    }

    const location = useLocation()
    const { continentId } = location.state


    useEffect(() => {
        fetch(`/continents/${continentId}?page=${page}`)
            .then((res) => res.json())
            .then((data) => {
                setCountries(data.countries)
                setTotalCountries(data.total_countries)
            })
    }
        , [continentId, page])

    
    console.log(totalCountries)
    console.log(countries)
    const items = countries.map((country) => {
        return (<div key={country.id}>
            <Link to="/country" state={{ continentId: country.continent_id,countryId:country.id }}>
                {country.common_name}
            </Link>
            

        </div>);
    })
    return (<>
        {items}
        <Page
            totalCountries={totalCountries}
            prevPagefunc={prevPagefunc}
            nextPagefunc={nextPagefunc}
            page={page}
        />
    </>)

}

export default Continent;