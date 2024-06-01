import { Footer } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'
import {BsFacebook , BsInstagram , BsTwitter , BsGithub} from "react-icons/bs"

const FooterPage = () => {
  return (
    <Footer container className='border border-t-8 border-teal-500'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
          <div>
          <Link to ="/" className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white '>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Mohamad</span>
                Blog
          </Link>
          </div>
          <div className='grid grid-cols-2 gap-3 sm:mt-4 sm:grid-cols-3 sm:gap-6'>
            <div>
              <Footer.Title title ='About' />
              <Footer.LinkGroup col>
                <Footer.Link>
                  Link 1
                </Footer.Link>

                <Footer.Link>
                  Link 2
                </Footer.Link>

                <Footer.Link>
                  Link 3
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title ='Follow us' />
              <Footer.LinkGroup col>
                <Footer.Link>
                 Github
                </Footer.Link>

                <Footer.Link>
                  Discord
                </Footer.Link>

                <Footer.Link>
                  Instagram
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title ='Legal' />
              <Footer.LinkGroup col>
                <Footer.Link>
                 Privacy
                </Footer.Link>

                <Footer.Link>
                  Terms on condition
                </Footer.Link>

                <Footer.Link>
                  policies
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider/>
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <Footer.Copyright by ="Mohamad blog" />
          <div className='flex gap-2 sm:mt-0 mt-4 sm:justify-center'>
            <Footer.Icon href='#' icon ={BsFacebook} />
            <Footer.Icon href='#' icon ={BsTwitter} />
            <Footer.Icon href='#' icon ={BsInstagram} />
            <Footer.Icon href='#' icon ={BsGithub} />
          </div>
        </div>
      </div>
    </Footer>
  )
}

export default FooterPage