import { Button, Modal, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import {FaCheck , FaTimes} from "react-icons/fa"
const DashComments = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [comments, setComments] = useState([]);
    const [showMore, setShowMore] = useState(true)
    const [showModel , setShowModel] =useState(false)
    const [commentIdToDelete, setCommentIdToDelete] = useState('')
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getcomments`);
                if (res.ok) {
                    const data = await res.json();
                    setComments(data.comments);
                    if(data.comments.length < 9){
                        setShowMore(false);
                    }
                } else {
                    throw new Error('Failed to fetch comments');
                }
            } catch (e) {
                console.error('Error fetching comments:', e);
            }
        };

        if (currentUser.isAdmin) {
            fetchComments();
        } 
    }, [currentUser._id]);

    const handleShowMore = async() =>{
        const startIndex = comments.length ;
        try{
            const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);
            const data = await res.json()
            console.log(data);
            if(res.ok){
                setComments((prev)=> [...prev, ...data.comments])
                if(data.comments.length <9){
                    setShowMore(false)
                }
            }
        }catch(e){

        }
    }

    const handleDeleteComment = async()=> {
        setShowModel(false)
        try{
            
            const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`,{
                method:'DELETE',
            })
            const data = await res.json()
            if(res.ok){
                setComments((prev)=>prev.filter((comment)=>comment._id !==commentIdToDelete))
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
        {currentUser.isAdmin && comments.length >0 ? (
            <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date Created</Table.HeadCell>
                            <Table.HeadCell>Comment content</Table.HeadCell>
                            <Table.HeadCell>number of likes</Table.HeadCell>
                            <Table.HeadCell>POSTID</Table.HeadCell>
                            <Table.HeadCell>USERID</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        {comments.map((comment)=>(
                            <Table.Body className='divide-y' key={comment._id}>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                <Table.Cell>{comment.updatedAt ? new Date(comment.updatedAt).toLocaleDateString() : 'N/A'}</Table.Cell>
                                    <Table.Cell>
                                                {comment.content}
                                    </Table.Cell>

                                    <Table.Cell>
                                            {comment.numberOfLikes}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {comment.postId}
                                    </Table.Cell>

                                    <Table.Cell>
                                    {comment.userId}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span className='font-medium text-red-500 hover:underline ' onClick={()=>{setShowModel(true); setCommentIdToDelete(comment._id) }}>
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
            <p>No comments yet</p>
        )}
                    <Modal show ={showModel} onClose={()=>setShowModel(false)}
             popup size= 'md'  >
                <Modal.Header/>
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500'>Are you Sure you wanna delete the comment ?</h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={()=>handleDeleteComment()}>
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

export default DashComments;
