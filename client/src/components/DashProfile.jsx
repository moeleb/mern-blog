import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
// import getStorage from 'redux-persist/es/storage/getStorage';
import { getStorage, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { app } from '../firebase';
import { updateFailure, updateStart,updateSucess,deleteUserFailure,deleteUserStart,deleteUserSuccess,signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';
const DashProfile = () => {
    const { currentUser, error } = useSelector(state => state.user);
    const [imageFile,setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadingProgress ,setImageFileUploadingProgress ] = useState(null)
    const [imageFileUploadingError ,setImageFileUploadingError ] = useState(null)
    const filePickerReference = useRef()
    const [formData, setFormData] = useState({})
    const [showModel, setShowModel] = useState(false)
    const dispatch = useDispatch()
    const handleImageChange = (e) =>{
        const file = e.target.files[0]
        if(file){
            setImageFile(e.target.files[0])
            setImageFileUrl(URL.createObjectURL(file));
        }

    } 
    const handleClick = () => {
        if (filePickerReference.current) {
          filePickerReference.current.click();
        }
      };
    useEffect(()=>{
        if(imageFile){
            uploadImage();
        }   
    },[imageFile])

    const uploadImage = async () =>{
        console.log("upload Image...")
        const storage = getStorage(app)
    const fileName = new Date().getTime() + imageFile.name ;
        const storageRef = ref(storage,fileName)
        const uploadTask = uploadBytesResumable(storageRef,imageFile);
        uploadTask.on(
            'state_changed',
            (snapshot) =>{
                const progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100
                setImageFileUploadingProgress(progress.toFixed(0));
            },
            (error) =>{
                setImageFileUploadingError('Could not upload Image file must be less than 2 MB')
            },
            ()=>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                    setImageFileUrl(downloadURL);
                    setFormData({...formData, profilePicture:downloadURL})
                })
            }
        )
    }
    const handleChange = (e) =>{
        setFormData({...formData, [e.target.id]:e.target.value});
    }
    const handleSubmit =async(e) =>{
        e.preventDefault()
        if(Object.keys(formData).length===0){
            return ;
        }
        try{
            dispatch(updateStart());
            const res = await fetch(`/api/users/update/${currentUser._id}`,{
                method :'PUT',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(formData),
            })
            const data = await res.json()
            if(!res.ok){
                dispatch(updateFailure(data.message))
            } else{
                dispatch(updateSucess(data))
            }
        }catch(e){
            // console.log(e)
            dispatch(updateFailure(e.message))

        }
    }
    const handleDeleteUser = async () =>{
        setShowModel(false);
        try{
            dispatch(deleteUserStart)
            const res = await fetch(`/api/users/delete/${currentUser._id}`,{
                method:'Delete',
                headers :{
                    'Content-Type' : 'application/json'
                }
                
            })
            const data = await res.json();
            if(!res.ok){
                dispatch(deleteUserFailure(data.message))
            } else {
                dispatch(deleteUserSuccess(data));
            }
        } catch(e){
            dispatch(deleteUserFailure)
        }
    }
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
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='text-center mb-4'>Profile</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <input type="file"accept ='image/*' onChange={handleImageChange}  ref = {filePickerReference} hidden/>
                <div className='w-32 h-32 cursor-pointer shadow-md overflow-hidden' onClick={handleClick} >
                    <img 
                        src={ imageFileUrl || currentUser.profilePicture} 
                        alt='user' 
                        className='rounded-full w-full h-full border-8 object-cover border-[lightgray]' 
                    />
                </div>
                <TextInput type='text' id ='username' placeholder='username' defaultValue={currentUser.username}onChange={handleChange} />
                <TextInput type='email' id ='email' placeholder='username' defaultValue={currentUser.email}onChange={handleChange} />
                <TextInput type='password' id ='password' onChange={handleChange} />
                <Button type='submit' gradientDuoTone='purpleToBlue' outline>
                    Update
                </Button>
                {currentUser.isAdmin && (
                    <Link to ={'/create-post'}>
                    <Button type='button' gradientDuoTone='purpleToPink' className='w-full'>
                        Create a post
                    </Button>
                
                    </Link>
                )}
            </form>
            <div className='text-red-500 flex justify-between mt-5'>

                <span  onClick={()=>setShowModel(true)} className='cursor-pointer'>Delete Account</span>
                <span onClick={handleSignOut} className='cursor-pointer'>Sign Out</span>
            </div>
            {/* {updateSucess && (
                <Alert color='success' className='mt-5'>
                    {updateSucess}
                </Alert>
            )}
            {updateFailure && (
                <Alert color='failure' className='mt-5'>
                    {updateFailure}
                </Alert>
            )} */}
            {error && (
                <Alert color='failure' className='mt-5'>
                    {error}
                </Alert>
            )} 
            <Modal show ={showModel} onClose={()=>setShowModel(false)}
             popup size= 'md'  >
                <Modal.Header/>
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500'>Are you Sure you wanna delete your account ?</h3>
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
    );
}

export default DashProfile;
