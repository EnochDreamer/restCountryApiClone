import { useState } from "react";
import './styles/country.css'
import { Link } from "react-router-dom";




function Country({ country, handleDel, user, continents,setFlashMessage }) {


    const [show, setShow] = useState(false)
    function showDetail() {
        setShow((prev) => !prev)
    }








    return (
        <div className="country" onMouseEnter={showDetail} onMouseLeave={showDetail}>
            <div className="country-items"  >
                <div className="country-name">
                    {country.common_name}
                </div>
                <div className="country-continent">
                    {country.continent_name}
                </div>

                {show && <><div className="country-currency">
                    {country.currency}
                </div>
                    <div className="country-population">
                        {country.population}
                    </div>

                    <div className="country-cca3">
                        {country.cca3}
                    </div>
                </>}
            </div>
            {(user.is_authenticated) && <div className="country-actions">
                <svg onClick={() => handleDel(country.id)} className="delete" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M261 936q-24.75 0-42.375-17.625T201 876V306h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438V306ZM367 790h60V391h-60v399Zm166 0h60V391h-60v399ZM261 306v570-570Z" /></svg>
                <Link to='/edit' state={{ 'continents': continents, 'country': country }}  data={{'setFlashMessage':setFlashMessage}} >
                    <svg className="edit" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M180 876h44l443-443-44-44-443 443v44Zm614-486L666 262l42-42q17-17 42-17t42 17l44 44q17 17 17 42t-17 42l-42 42Zm-42 42L248 936H120V808l504-504 128 128Zm-107-21-22-22 44 44-22-22Z" /></svg>
                </Link>
            </div>}
        </div>

    );
}

export default Country;