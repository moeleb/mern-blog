import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Modal, Textarea } from 'flowbite-react';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const CommentSection = ({ postId }) => {
    const { currentUser } = useSelector(state => state.user);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [showModal , setShowModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await fetch(`/api/comment/getPostComments/${postId}`);
                if (res.ok) {
                    const data = await res.json();
                    setComments(data);
                }
            } catch (e) {
                console.log(e);
            }
        };
        getComments();
    }, [postId]);

    const handleLike = async (commentId) => {
        try {
            if (!currentUser) {
                navigate('/sign-in');
                return;
            }
            const res = await fetch(`/api/comment/likeComment/${commentId}`, {
                method: 'PUT'
            });
            if (res.ok) {
                const data = await res.json();
                setComments(comments.map(comment =>
                    comment._id === commentId ? {
                        ...comment,
                        likes: data.likes,
                        numberOfLikes: data.likes.length,
                    } : comment
                ));
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleUpdate = (updatedComment) => {
        setComments(comments.map(comment =>
            comment._id === updatedComment._id ? updatedComment : comment
        ));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: comment, postId, userId: currentUser._id })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Something went wrong');
            }

            const data = await res.json();
            setComment("");
            setComments([data, ...comments]);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async (commentId) =>{

    }

    return (
        <div className='max-w-2xl mx-auto p-3'>
            {currentUser ? (
                <div className='flex items-center gap-1 my-5 text-gray-500 text-s'>
                    <p>Signed in as:</p>
                    <img className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePicture} alt="" />
                    <Link to={'/dashboard?tab=profile'} className='text-xs text-cyan-600 hover:underline'>
                        @{currentUser.username}
                    </Link>
                </div>
            ) : (
                <div>
                    You must be signed in to comment
                    <Link to={'/sign-in'}>
                        Sign in
                    </Link>
                </div>
            )}
            {currentUser && (
                <form className='border border-teal-500 rounded-md p-3' onSubmit={handleSubmit}>
                    <Textarea
                        placeholder='Add a comment'
                        rows='3'
                        cols='100'
                        maxLength='200'
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                    />
                    <div className='flex justify-between items-center mt-5'>
                        <p className='text-gray-500 text-xs'>{200 - comment.length} remaining</p>
                        <Button outline gradientDuoTone='purpleToBlue' type='submit'>
                            Submit
                        </Button>
                    </div>
                </form>
            )}
            {comments.length === 0 ? (
                <p className='text-sm my-5'>No comments yet</p>
            ) : (
                <>
                    <div className='text-sm my-5 flex items-center gap-1'>
                        <p>Comments</p>
                        <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                            <p>{comments.length}</p>
                        </div>
                    </div>
                    {comments.map((comment) => (
                        <Comment
                            key={comment._id}
                            comment={comment}
                            onLike={handleLike}
                            onUpdate={handleUpdate} // Pass the handleUpdate function to the Comment component
                            onDelete={(commentId)=>{
                                setShowModal(true)
                                setCommentToDelete(commentId)
                            }}
                        />
                    ))}
                </>
            )}
            <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
                <Modal.Header/>
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500'>Are you Sure you wanna delete your Post ?</h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={()=>handleDeletePost()}>
                                Yes I am
                                </Button>
                            <Button onClick={()=>setShowModal(false)}>
                                No
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default CommentSection;
