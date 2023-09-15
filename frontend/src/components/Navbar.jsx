import React from 'react'

const Navbar = () => {
  return (
    
<nav className="bg-gray-700 border-gray-200  ">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <a href="/" className="flex items-center">
        <img src="/chatgpt.png" className="h-8 mr-3" alt="Logo" />
        <span className="self-center text-white text-2xl font-semibold whitespace-nowrap dark:text-white">Chat with PDF</span>
    </a>
  </div>
</nav>

  )
}

export default Navbar
