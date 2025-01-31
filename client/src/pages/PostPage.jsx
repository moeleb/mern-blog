import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';

const PostPage = () => {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/post/getPosts?slug=${postSlug}`);
                const data = await res.json();
                if (!res.ok) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                if (res.ok) {
                    setPost(data.posts[0]);
                    setLoading(false);
                    setError(false);
                }
            } catch (e) {
                setError(true);
                setLoading(false);
            }
        };
        fetchPost();
    }, [postSlug]);

    if (loading) {
        return <div className='flex justify-center items-center min-h-screen'>
            <Spinner size='xl'/>
        </div>;
    }

    if (error) {
        return <div>Error loading post.</div>;
    }

    if (!post) {
        return <div>No post found.</div>;
    }

    return (
        <main className='p-3 flex flex-col max-w-6-xl min-h-screen'>
            <h1 className='text-3xl mt-10 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post.title}</h1>
            <Link className='self-center mt-4' to ={`/search?category=${post && post.category}`}>
                <Button color='gray' pill size ='xs' className=''>{post  && post.category}</Button>
            </Link>
            <img  src= {post && post.image} alt ={post && post.title} className='mt-10 p-3 max-h-[600px] w-full object-cover'/>
            <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
                <span>{post && new Date(post.createdAt).toLocaleString()}</span>
                <span className='italic'> { post && (post.content.length/1000).toFixed(0) } mins Read</span>
            </div>
            <div className='p-3 max-w-2xl mx-auto w-full' dangerouslySetInnerHTML={{__html: post && post.content}}>
            </div>
                <div className='max-w-4xl mx-auto w-full'>
                    <CallToAction/>
                </div>
                <CommentSection postId = {post._id}/>
        </main>
    );
};

export default PostPage;
