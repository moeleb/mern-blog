import { Button, Modal, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const DashPosts = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [showMore, setShowMore] = useState(true)
    const [showModel , setShowModel] =useState(false)
    const [postIdToDelete, setPostIdToDelete] = useState('')
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/getPosts?userId=${currentUser._id}`);
                if (res.ok) {
                    const data = await res.json();
                    setUserPosts(data.posts);
                    if(data.length < 9){
                        setShowMore(false);
                    }
                } else {
                    throw new Error('Failed to fetch posts');
                }
            } catch (e) {
                console.error('Error fetching posts:', e);
            }
        };

        if (currentUser.isAdmin) {
            fetchPosts();
        } else {
            setUserPosts([]); // Reset userPosts if not an admin
        }
    }, [currentUser.isAdmin, currentUser._id]);

    const handleShowMore = async() =>{
        const startIndex = userPosts.length ;
        try{
            const res = await fetch(`/api/post/getPosts?userId=${currentUser._id}&startIndex=${startIndex}`);
            const data = await res.json()
            console.log(data);
            if(res.ok){
                setUserPosts((prev)=> [...prev, ...data.posts])
                if(data.posts.length <9){
                    setShowMore(false)
                }
            }
        }catch(e){

        }
    }
    const handleDeletePost = async()=>{
        setShowModel(false);
        try{
            const res = await fetch(`/api/post/delete/${postIdToDelete}/${currentUser._id}`,{
                method: 'DELETE'
            })
            const data = await res.json();
            console.log(data)
            if(!res.ok){
                console.log(data.message);
            } else{
                setUserPosts((prev)=>
                    prev.filter((post)=>post._id!==postIdToDelete)
                )
            }
        }catch(e){
            console.log(e.message)
        }
    }
    return <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-300 dark:scrollbar-track-slate-800'>
        {currentUser.isAdmin && userPosts.length >0 ? (
            <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date Updated</Table.HeadCell>
                            <Table.HeadCell>Post Image</Table.HeadCell>
                            <Table.HeadCell>Post title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                            <Table.HeadCell>
                                <span>Edit</span>
                            </Table.HeadCell>
                        </Table.Head>
                        {userPosts.map((post)=>(
                            <Table.Body className='divide-y'>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell>
                                        <Link to ={`/post/${post.slug}`}>
                                            <img src={post.image} alt={post.title} className='w-20 h-10 object-cover bg-gray-500' />
                                        </Link>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <Link to ={`post/${post.slug}`}>
                                            {post.title}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {post.category}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span className='font-medium text-red-500 hover:underline ' onClick={()=>{setShowModel(true); setPostIdToDelete(post._id) }}>
                                            Delete
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/update-post/${post._id}`}>
                                        <span className='font-medium hover:underline text-teal-500'>
                                            Edit
                                        </span>
                                        </Link>
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
            <p>No posts yet</p>
        )}
                    <Modal show ={showModel} onClose={()=>setShowModel(false)}
             popup size= 'md'  >
                <Modal.Header/>
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500'>Are you Sure you wanna delete your Post ?</h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={()=>handleDeletePost()}>
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

export default DashPosts;
