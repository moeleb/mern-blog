import { Button, Modal, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import {FaCheck , FaTimes} from "react-icons/fa"
const DashUsers = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true)
    const [showModel , setShowModel] =useState(false)
    const [userIdToDelete, setUserIdToDelete] = useState('')
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/users/getusers`);
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data.users);
                    if(data.users.length < 9){
                        setShowMore(false);
                    }
                } else {
                    throw new Error('Failed to fetch users');
                }
            } catch (e) {
                console.error('Error fetching users:', e);
            }
        };

        if (currentUser.isAdmin) {
            fetchUsers();
        } 
    }, [currentUser._id]);

    const handleShowMore = async() =>{
        const startIndex = users.length ;
        try{
            const res = await fetch(`/api/users/getUsers?startIndex=${startIndex}`);
            const data = await res.json()
            console.log(data);
            if(res.ok){
                setUsers((prev)=> [...prev, ...data.users])
                if(data.users.length <9){
                    setShowMore(false)
                }
            }
        }catch(e){

        }
    }

    const handleDeleteUser = async()=> {
        try{
            const res = await fetch(`/api/users/delete/${userIdToDelete}`,{
                method:'DELETE',
            })
            const data = await res.json()
            if(res.ok){
                setUsers((prev)=>prev.filter((user)=>user._id !==userIdToDelete))
                setShowModel(false)
            } else{
                console.log(data.message);
            }
        }
        catch(e){
            console.log(e.message)
        }

    }

    return <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-300 dark:scrollbar-track-slate-800'>
        {currentUser.isAdmin && users.length >0 ? (
            <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date Created</Table.HeadCell>
                            <Table.HeadCell>User Image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Admin</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        {users.map((user)=>(
                            <Table.Body className='divide-y' key={user._id}>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell>
                                            <img src={user.profilePicture} alt={user.username} className='w-10 h-10 object-cover bg-gray-500  rounded-full' />
                                    </Table.Cell>

                                    <Table.Cell>
                                            {user.username}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {user.email}
                                    </Table.Cell>

                                    <Table.Cell>
                                        {user.isAdmin? (<FaCheck className ="text-green-500"/>) : (<FaTimes className="text-red-500"/>)}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span className='font-medium text-red-500 hover:underline ' onClick={()=>{setShowModel(true); setUserIdToDelete(user._id) }}>
                                            Delete
                                        </span>
                                    </Table.Cell>

                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                    {showMore && (
                        <button  onClick = {handleShowMore}className='w-full text-teal-500 self-centertext-sm py-7'>
                            show more
                        </button>
                    )}
            </>
        ) :(
            <p>No users yet</p>
        )}
                    <Modal show ={showModel} onClose={()=>setShowModel(false)}
             popup size= 'md'  >
                <Modal.Header/>
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500'>Are you Sure you wanna delete the user ?</h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={()=>handleDeleteUser()}>
                                Yes I am sure
                            </Button>
                            <Button onClick={()=>setShowModel(false)}>
                                No
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
    </div>
};

export default DashUsers;
