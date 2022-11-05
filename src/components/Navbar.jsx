import React from 'react'
import logo from '../img/logo.png'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/authContext' 

export default function Navbar() {
  const {logout,currentUsername} = useContext(AuthContext)
  const onLogout = function(){
    logout()
  }
  return (
    <div className='navbar'>
      <div className='container'>
        <div className='logo'><Link to='/'><img src={logo} alt="logo" /></Link></div>
        <div className='links'>
          <Link className='link' to='/?cat=art'><h6>ART</h6></Link>
          <Link className='link' to='/?cat=science'><h6>SCIENCE</h6></Link>
          <Link className='link' to='/?cat=technology'><h6>TECHNOLOGY</h6></Link>
          <Link className='link' to='/?cat=cinema'><h6>CINEMA</h6></Link>
          <Link className='link' to='/?cat=design'><h6>DESIGN</h6></Link>
          <Link className='link' to='/?cat=food'><h6>FOOD</h6></Link>
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
