import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    }
    fetchPosts();
  }, []);

  return (
    <div>
      <div className='flex flex-col gap-6 lg:p-28 p-3 max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to my Blog</h1>
        <p>Here you will find nothing important!</p>
        <Link to={'/search'} className='text-xs sm:text-sm text-teal-500'>View more posts</Link>
      </div>
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {posts && posts.length > 0 && (
          <div>
            <h2 className='text-2xl font-semibold text-center'>Recent Posts:</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {posts.map((post) => (
                <div key={post._id} className='relative group overflow-hidden rounded-lg shadow-lg'>
                  <img src={post.image || 'default_image_url.jpg'} alt={post.title} className='w-full h-48 object-cover transition-transform duration-300 ease-in-out group-hover:scale-110' />
                  <div className='p-4'>
                    <h3 className='text-lg font-bold'>{post.title}</h3>
                    <p className='text-gray-500'>{post.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
