import { Button } from 'flowbite-react'
import React from 'react'

const CallToAction = () => {
  return (
    <div>
        <div className=''>
            <h2>
                Want to learn more about js?
            </h2>
            <p>
                Check out these resources?
            </p>
            <Button gradientDuoTone='purpleToPink'>
                <a href="#">Learn More</a>
            </Button>
        </div>
        <div className='p-7'>
            <img src="" alt="JS" />
        </div>
    </div>
  )
}

export default CallToAction