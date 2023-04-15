import './styles/page.css'

function Page({page,totalCountries,prevPagefunc,nextPagefunc}) {
   var countries_per_page=5
 
    return (<>
    <div className="page">
         <button className={(page>1)?'prev-btn':'prev-btn disabled'} onClick={prevPagefunc}>Prev Page</button>
        <div className='page-count'>{page}/{Math.ceil(totalCountries/countries_per_page)} </div>
        <button  className={(page*countries_per_page)<totalCountries?"next-btn":'next-btn disabled'} onClick={nextPagefunc}>Next Page</button>
    </div>
            
    </>)
        
    }
    

export default Page;
