import { useState, useEffect } from 'react';
import Page from './Page'
import { Link} from 'react-router-dom'
function Countries() {
    const [countries, setCountries] = useState([])
    const [totalCountries, setTotalCountries] = useState(1)
    const [page, setPage] = useState(1)
    console.log(totalCountries)
    function nextPagefunc() {
        setPage((prevPage) => (prevPage + 1))
    }
    function prevPagefunc() {
        setPage((prevPage) => (prevPage - 1))
    }

    useEffect(() => {
        fetch(`/countries/all?page=${page}`)
            .then((res) => res.json())
            .then((data) => {
                setCountries(data.countries)
                setTotalCountries(data.total_countries)
            })
    }
        , [page])

    const items = countries.map((country) => {
        return (<div key={country.id}>
            <Link to="/country" state={{ continentId: country.continent_id, countryId: country.id }}>
                {country.common_name}
            </Link>
        </div>
        )
    })

    return (<>
        {items}
        <Page
            totalCountries={totalCountries}
            prevPagefunc={prevPagefunc}
            nextPagefunc={nextPagefunc}
            page={page}
        />

    </>

    )
}

export default Countries;
