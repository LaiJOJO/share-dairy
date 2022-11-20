import React,{Fragment} from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Search from '../../components/Search'

export default function Layout() {
  return (
    <Fragment>
      <Navbar/>
      <Search/>
      <Outlet/>
      <Footer/>
    </Fragment>
  )
}
