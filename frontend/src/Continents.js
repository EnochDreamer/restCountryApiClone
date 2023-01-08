import {useState,useEffect} from 'react'
import { Link} from 'react-router-dom'


function Continents() {
    const [continents, setContinents] = useState([])
    useEffect(() => {
        fetch('/continents')
            .then((res) => res.json())
            .then((data) => {
                setContinents(data)

            })
    }
        , [])
    

    return (
        continents.map((continent) => {
            return (<>
                <div key={continent.id}>
                    <Link to="/continent" state={{continentId:continent.id}}>
                        {continent.name}
                    </Link>
                </div>

            </>

            )
        })
    );
}

export default Continents;