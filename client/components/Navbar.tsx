'use client'

import { status_login } from '@/contant'

let status = status_login

const NavLogin = () => {
  return (
    // <Navbar fluid className='bg-fuchsia-800 border-b-2'>
    //   <Navbar.Brand>
    //     <Image src='/icon.svg' alt='logo' width={100} height={100} />
    //   </Navbar.Brand>
    //   <Navbar.Collapse>
    //     <Navbar.Brand className='font-semibold text-white cursor-pointer'>
    //       <FaCloudArrowDown className='inline-block ml-2 text-lg' />
    //       <span className='hover:text-pink-400 ease-out duration-300 text-lg'>Tải xuống Slack</span>
    //     </Navbar.Brand>
    //   </Navbar.Collapse>
    //   <Navbar.Collapse className='justify-end'>
    //     <Navbar.Brand className='font-semibold text-gray-800 cursor-pointer '>
    //       <div className='bg-white rounded-sm p-2 hover:ring-4 hover:scale-95 ease-out duration-300'>
    //         <span className='text-base'>TẠO KHÔNG GIAN LÀM VIỆC</span>
    //       </div>
    //     </Navbar.Brand>
    //   </Navbar.Collapse>
    // </Navbar>
    <nav>long</nav>
  )
}

const NavRegister = () => {
  return (
    // <Navbar fluid className="bg-fuchsia-800 border-b-2">
    //   <Navbar.Brand>
    //     <Image src="/icon.svg" alt="logo" width={100} height={100} />
    //   </Navbar.Brand>
    //   <Navbar.Collapse>
    //     <Navbar.Brand className="font-semibold text-white cursor-pointer">
    //       <FaCloudArrowDown className="inline-block ml-2 text-lg" />
    //       <span className="hover:text-pink-400 ease-out duration-300 text-lg">
    //         Tải xuống Slack
    //       </span>
    //     </Navbar.Brand>
    //   </Navbar.Collapse>
    //   <Navbar.Collapse className="justify-end">
    //     <Navbar.Brand className="font-semibold text-gray-800 cursor-pointer">
    //       <span className="text-white font-semibold cursor-pointer text-lg">
    //         Sign in
    //       </span>
    //     </Navbar.Brand>
    //     <Navbar.Brand className="font-semibold text-gray-800 cursor-pointer ">
    //       <div className="bg-white rounded-sm p-2 hover:ring-4 hover:scale-95 ease-out duration-300">
    //         <span className="text-base">DÙNG THỬ MIỄN PHÍ</span>
    //       </div>
    //     </Navbar.Brand>
    //   </Navbar.Collapse>
    // </Navbar>
    <nav>long</nav>
  )
}

const DefaultNavbar = () => {
  let Layout = <NavRegister />
  if (status === 'success') {
    Layout = <NavLogin />
  }
  return Layout
}

export default DefaultNavbar
