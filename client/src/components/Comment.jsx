import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Comment = ({ comment, onLike, onUpdate, onDelete }) => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/users/${comment.userId}`);
                const data = await res.json();
                if (res.ok) {
                    setUser(data);
                }
            } catch (e) {
                console.log(e);
            }
        };
        getUser();
    }, [comment.userId]);

    const handleEdit = async () => {
        try {
            const res = await fetch(`/api/comment/editComment/${comment._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: editContent }),
            });

            if (res.ok) {
                const updatedComment = await res.json();
                setIsEditing(false);
                onUpdate(updatedComment); // Notify the parent component of the update
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
            <div className='flex-shrink-0 mr-3'>
                <img
                    className='w-10 h-10 rounded-full bg-gray-200'
                    src={user.profilePicture}
                    alt={user.username}
                />
            </div>
            <div className='flex-grow'>
                <div className='flex items-center mb-1'>
                    <span className='font-bold mr-2 text-xs truncate'>
                        {user ? `@${user.username}` : "anonymous user"}
                    </span>
                    <span className='text-gray-500 text-xs'>
                        {moment(comment.createdAt).fromNow()}
                    </span>
                </div>
                {isEditing ? (
                    <>
                        <textarea
                            className='w-full text-gray-700 bg-gray-200 rounded-md resize-none focus:bg-gray-100'
                            rows='3'
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                        />
                        <button
                            className='mt-2 text-blue-500 hover:text-blue-700'
                            onClick={handleEdit}
                        >
                            Save
                        </button>
                        <button
                            className='mt-2 text-red-500 hover:text-red-700 ml-2'
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <p className='mb-2 text-gray-700 dark:text-gray-300'>
                            {comment.content}
                        </p>
                        <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
                            <button
                                className={`text-gray-300 hover:text-blue-500 ${currentUser && comment.likes && comment.likes.includes(currentUser._id) ? 'text-blue-500' : ''}`}
                                type='button'
                                onClick={() => onLike(comment._id)}
                            >
                                <FaThumbsUp className='mr-1 text-sm' />
                            </button>
                            <p className='ml-2 text-gray-400'>
                                {comment.numberOfLikes > 0 && `${comment.numberOfLikes} ${comment.numberOfLikes === 1 ? "like" : "likes"}`}
                            </p>
                        </div>
                        {currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                            <>
                            <button
                                type='button'
                                className='text-gray-400 hover:text-blue-500 ml-2'
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </button>
                            <button
                                type='button'
                                className='text-gray-400 hover:text-red-500 ml-2'
                                onClick={() => onDelete(comment._id)}
                            >
                                Delete
                            </button>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Comment;
