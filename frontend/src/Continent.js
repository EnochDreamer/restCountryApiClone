function Continent({name,id,handleContinent}) {

    
    return ( 
    <li 
    onClick={()=>handleContinent(id)} >
        {name}
    </li>
     );
}

export default Continent;