import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";


function Country() {
    const [country, setCountry] = useState({})

    const location = useLocation()
    const { continentId,countryId } = location.state
    console.log(continentId,countryId)

    useEffect(() => {
        fetch(`/continents/${continentId}/${countryId}`)

            .then((res) => res.json())
            .then((data) => {
                setCountry(data)
            })
    }
        , [continentId, countryId])

console.log(country)
    return (
        <div >
            <p>
                {country.common_name}
            </p>
            <p>
                {country.currency}
            </p>
            <p>
                {country.population}
            </p>
            <p>
                {country.continent_name}
            </p>
            <p>
                {country.cca3}
            </p>
        </div>
    );
}

export default Country;