import React from 'react'
import logo from '../img/logo.png'

export default function Footer() {
  return (
    <footer>
      <div className='footer'>
        <img src={logo} alt="logo" />
        <span>Welcome to Share-Dairy <span style={{'color':'red','fontSize':'16px'}}>❤</span></span>
      </div>
    </footer>
  )
}
