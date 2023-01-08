
function Page(props) {
   var countries_per_page=2
 
    return (<>
            {((props.page)>1) && <button onClick={props.prevPagefunc}>Previous Page</button>}
            {(((props.page)*countries_per_page)<(props.totalCountries)) && <button onClick={props.nextPagefunc}>Next Page</button>}
    </>)
        
    }
    

export default Page;