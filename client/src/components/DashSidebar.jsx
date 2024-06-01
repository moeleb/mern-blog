import { Sidebar } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import {HiUser, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup} from "react-icons/hi"
import { useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { signoutSuccess } from '../redux/user/userSlice'
import { useSelector } from 'react-redux'
const DashSidebar = () => {
    const { currentUser, error } = useSelector(state => state.user);
    const location = useLocation()
    const [tab,setTab] = useState('');
    const dispatch = useDispatch()
      useEffect(()=>{
      const urlParms = new URLSearchParams(location.search)
      const tabFromUrl = urlParms.get('tab')
      if(tabFromUrl){
        setTab(tabFromUrl)
      }
    },[location.search])
    const handleSignOut = async() =>{
      try{
          const res =await fetch('api/users/signout', {
              method :'POST',
          })
          const data  = await res.json()
          if(!res.ok){
              console.log(data.message)
          } else {
              dispatch(signoutSuccess())
          }
      } catch(e){
          console.log(e.message)
      }
  }
  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-2'>
                    <Link to ="/dashboard?tab=profile">
                <Sidebar.Item active = {tab==='profile'} icon = {HiUser} label ={currentUser.isAdmin ? 'Admin' : 'User'} labelColor ='dark' as ='div'>
                    Profile
                </Sidebar.Item>
                    </Link>
                    {currentUser.isAdmin && (
                    <Link to ="/dashboard?tab=posts">
                <Sidebar.Item active = {tab==='posts'} icon = {HiDocumentText} label ={'posts'} labelColor ='dark' as ='div'>
                    Posts
                </Sidebar.Item>
                    </Link>
                    )}

                    {currentUser.isAdmin && (
                    <Link to ="/dashboard?tab=users">
                <Sidebar.Item active = {tab==='users'} icon = {HiOutlineUserGroup} label ={'users'} labelColor ='dark' as ='div'>
                    Users
                </Sidebar.Item>
                    </Link>
                    )}
                    {currentUser.isAdmin && (
                    <Link to ="/dashboard?tab=comments">
                <Sidebar.Item active = {tab==='comments'} icon = {HiOutlineUserGroup} label ={'comments'} labelColor ='dark' as ='div'>
                    Comments
                </Sidebar.Item>
                    </Link>
                    )}
                    {currentUser.isAdmin && (
                    <Link to ="/dashboard?tab=dash">
                <Sidebar.Item active = {tab==='dash'} icon = {HiOutlineUserGroup} label ={'all'} labelColor ='dark' as ='div'>
                    Statistics
                </Sidebar.Item>
                    </Link>
                    )}
                <Sidebar.Item onClick = {handleSignOut}  icon = {HiArrowSmRight} >
                    SignOut
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar