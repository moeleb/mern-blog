import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link , useNavigate } from 'react-router-dom'
import { useDispatch , useSelector} from 'react-redux'
import { signInStart , signInFailure, signInSuccess }  from "../redux/user/userSlice"
import OAuth from '../components/OAuth'

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { loading, error: errorMessage } = useSelector(state => state.user);
  const dispatch = useDispatch();

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim()
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      dispatch(signInFailure("Please fill all the fields"));
      return;
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(signInFailure(data.message || 'Something went wrong'));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (e) {
      dispatch(signInFailure(e.message));
    }
  }

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row '>
        <div className='flex-1'>
          <Link to="/" className='font-bol dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Mohamad</span>
            Blog
          </Link>
          <p className='text-sm mt-5'>This is A MERN BLOG WEBSITE</p>
        </div>
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your email' />
              <TextInput
                type='email'
                placeholder='email'
                id='email' onChange={handleChange} />
            </div>
            <div>
              <Label value='Your password' />
              <TextInput
                type='password'
                placeholder='password'
                id='password' onChange={handleChange} />
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
              {
                loading ? (
                  <>
                    <Spinner size='sm' />
                    <span className='pl-3'>Loading...</span>
                  </>
                ) : 'Sign in'
              }
            </Button>
          <OAuth/>
          </form>
          <div className='flex-gap text-sm mt-5'>
            <span>Don't Have an account?</span>
            <Link to='/sign-up' className='text-blue-500'>Sign up</Link>
          </div>
          {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}

export default SignIn;
