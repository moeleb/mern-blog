import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import {  useNavigate } from 'react-router-dom'

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageURL, setImageURL] = useState('');
  const [publishError,setPublishError] = useState(null);
  const navigate = useNavigate()
  useEffect(() => {
    if (imageURL) {
      setFormData((prevFormData) => ({ ...prevFormData, image: imageURL }));
    }
  }, [imageURL]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          console.log(error);
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setImageURL(downloadURL);  // Set the image URL state
          });
        }
      );
    } catch (e) {
      console.log(e);
      setImageUploadError(e.toString());
      setImageUploadProgress(null);
    }
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("here");
    try{
        const res = await fetch('/api/post/create', {
            method: 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(formData) ,
        });
        const data = await res.json();
        if(!res.ok){
            setPublishError(data.message)
            return 
        }
        if(data.success===false){
            setPublishError(data.message)
            return ;
        }
        if(res.ok){
            setPublishError(null)
            navigate(`/post/${data.slug}`)
        }
    } catch(e){
        setPublishError(e.toString())
        console.log(e.toString());
    }
 }
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a Post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Select
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value='uncategorized'>Select a Category</option>
            <option value='javascript'>Javascript</option>
            <option value='python'>Python</option>
            <option value='next'>Next</option>
          </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            size='sm'
            outline
            onClick={handleUploadImage}
          >
            Upload Image
          </Button>
        </div>
        <ReactQuill
          theme='snow'
          placeholder='Write something'
          className='h-72 mb-12'
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        {imageUploadError && (
          <Alert color='failure'>
            {imageUploadError}
          </Alert>
        )}
        {formData.image && (
          <img
            src={formData.image}
            alt='Upload'
            className='w-full h-72'
          />
        )}
        <Button type='submit' gradientDuoTone='purpleToPink'>
          Publish
        </Button>
        {publishError && <Alert className='mt-5' color='failure'>{publishError}</Alert>}
      </form>
    </div>
  );
};

export default CreatePost;
