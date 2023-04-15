import { Link } from 'react-router-dom';
import './styles/header.css'
function Header({ continents, user, logout,setSearchTerm,searchTerm ,setPage,setFlashMessage}) {


    function handleInput(e) {
        const {value } = e.target
        setSearchTerm(() => {
            setPage(1)
            return value
            
        })
    }



    return (
        <div className='header-container' >
            <div className='logo-container'>

            </div>
            <div className='links-container'>
                <Link to='/add' state={{ 'continents': continents }} data={{'setFlashMessage':setFlashMessage}} >
                    Add countries
                </Link>
                <Link to='/about'>
                    about/contact
                </Link>
                {(user.is_authenticated) ? <>
                    <div className='to-user-profile'>
                        <Link onClick={logout}>
                            log-out
                        </Link>
                        <Link className='username' to='/profile'>
                            {user.user_name}
                        </Link>
                    </div>
                </> : <>
                    <Link to='/login'>
                        login
                    </Link>
                    <Link to='/sign-up'>
                        sign-up
                    </Link>
                </>
                }

                
                <input
                    style={{marginLeft:10}}
                    id='search'
                    placeholder='Enter search'
                    type='text'
                    name='search'
                    value={searchTerm}
                    onChange={handleInput}
                    required
                />
                
            </div>


        </div >
    );

}

export default Header;