import React from 'react'
import logo from '../img/logo.png'
import { Link, useSearchParams } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/authContext' 

export default function Navbar() {
  const {logout,currentUsername} = useContext(AuthContext)
  const onLogout = function(){
    logout()
  }
  const [search] = useSearchParams()
  return (
    <div className='navbar'>
      <div className='container'>
        <div className='logo'><Link to='/'><img src={logo} alt="logo" /></Link></div>
        <div className='links'>
          <Link className='link' to='/?cat=art'><h6 style={{fontWeight:search.get('cat') === 'art' ? 'bolder' : ''}}>ART</h6></Link>
          <Link className='link' to='/?cat=science'><h6 style={{fontWeight:search.get('cat') === 'science' ? 'bolder' : ''}}>SCIENCE</h6></Link>
          <Link className='link' to='/?cat=technology'><h6 style={{fontWeight:search.get('cat') === 'technology' ? 'bolder' : ''}}>TECHNOLOGY</h6></Link>
          <Link className='link' to='/?cat=cinema'><h6 style={{fontWeight:search.get('cat') === 'cinema' ? 'bolder' : ''}}>CINEMA</h6></Link>
          <Link className='link' to='/?cat=design'><h6 style={{fontWeight:search.get('cat') === 'design' ? 'bolder' : ''}}>DESIGN</h6></Link>
          <Link className='link' to='/?cat=food'><h6 style={{fontWeight:search.get('cat') === 'food' ? 'bolder' : ''}}>FOOD</h6></Link>
          <span>{currentUsername}</span>
          {currentUsername ? <span onClick={onLogout}>Logout</span> : <Link to='/login'>login</Link>}
          <span className='write'>
            <Link to='/write' className='link'>Write</Link>
          </span>
        </div>
      </div>
    </div>
  )
}
