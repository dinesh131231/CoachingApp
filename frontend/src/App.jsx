import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Note from './component/Note'
import Signup from './pages/signup.jsx'
import Login from './pages/login.jsx'
import Admin from './pages/Admin.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './component/ProtectedRoute.jsx'
import {PropagateLoader} from 'react-spinners'
import { Suspense, lazy } from "react";

const BACKEND_PORT_URL = import.meta.env.VITE_BACKEND_PORT_URL|| 'http://localhost:5000';



function App() {
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showNote, setShowNote] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    fetchFiles();
    fetchLinks();
  }, []);



  // Fetch links (url and lname) from backend

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_PORT_URL}/Links`);
      const data = await res.json();

      if (res.ok && data.links) {
        // Only keep url and lname
        setLinks(data.links.map(link => ({ url: link.url, lname: link.lname })));
      }
    } catch (err) {
      console.log('Error fetching links:', err);
    } finally {
    setLoading(false);
  }
  };

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`${BACKEND_PORT_URL}/files`);
      setFiles(res.data.data);          // ✅ fixed
      setLoading(false);
      console.log(res.data)

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault()

  }

  // if (loading) return <p>Loading...</p>;

  const isLoggedIn = window.localStorage.getItem('isLoggedIn')
  const usertype = window.localStorage.getItem('usertype')
  const token = window.localStorage.getItem('token')


  if (loading) {
  return (
    <div className="flex justify-center items-center h-screen">
      <PropagateLoader color="#862dc4" loading={true} />
    </div>
  );
}

  return (
    <>


      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/note" element={<Note />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={


          <div>


            <nav className="bg-purple-600 text-white shadow-lg">
              <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-5xl ml-5 font-bold">e-Accademy</h1>
                {/* Hamburger icon for mobile */}
                <button
                  className="md:hidden ml-auto focus:outline-none"
                  onClick={() => setNavOpen((prev) => !prev)}
                  aria-label="Toggle navigation menu"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                {/* Desktop nav */}
                <div className="hidden md:flex gap-4 ml-auto">
                  <button
                    onClick={() => setShowNote((prev) => !prev)}
                    className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition duration-200"
                  >
                    Notice
                  </button>
                  <button onClick={() => navigate('/signup')}
                    className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition duration-200">
                    Admin
                  </button>
                  {/* <button
                    onClick={() => navigate('/login')}
                    className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition duration-200"
                  >
                    Logout
                  </button> */}
                </div>
              </div>
              {/* Mobile dropdown menu */}
              {navOpen && (
                <div className="md:hidden bg-purple-700 px-4 py-2 flex flex-col gap-2">
                  <button
                    onClick={() => { setShowNote((prev) => !prev); setNavOpen(false); }}
                    className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition duration-200"
                  >
                    Notice
                  </button>
                  <button onClick={() => { navigate('/signup'); setNavOpen(false); }}
                    className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition duration-200">
                    Admin
                  </button>
                  {/* <button
                    onClick={() => { navigate('/login'); setNavOpen(false); }}
                    className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition duration-200"
                  >
                    Logout
                  </button> */}
                </div>
              )}
            </nav>



            {showNote && (
              <div
                className="fixed top-20 right-8 z-50"
                style={{ minWidth: '280px', maxWidth: '350px' }}
              >
                <Note />
              </div>
            )}

            <div className="p-8 max-w-7xl h-full mx-auto overflow-scroll overflow-x-hidden">
              <h2 className="text-3xl font-bold mb-6">Uploaded Files</h2>



              {/* Files Grid Cards */}
              <div className="grid grid-cols-1 text-center sm:grid-cols-2 md:grid-cols-3 lg:grid-col-4 gap-6">
                {files && files.length > 0 ? (
                  files.map((file) => (
                    <div
                      key={file._id}
                      onClick={() => setSelectedFile(file)}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg md:h-32 lg:h-48 transition cursor-pointer overflow-hidden sm:h-36 "
                    >
                      {/* Square Card Container */}
                      <div className="w-full h-20 bg-gray-100  items-center justify-center overflow-hidden relative hidden">
                        <iframe
                          src={`${BACKEND_PORT_URL}/${file.path.replace(/\\/g, "/")}`}
                          alt="file"
                          className="w-auto h-auto object-fill  hover:scale-105 transition-transform"
                        ></iframe>
                      </div>
                      {/* Card Footer with File Name */}
                      <div className="p-4">
                        <p className="text-sm font-semibold text-gray-800 truncate" title={file.originalName}>
                          {file.originalName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Path: {file.path}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">No files found</p>
                  </div>
                )}
              </div>
              
              {/* Modal for Selected File */}
              {selectedFile && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                  onClick={() => setSelectedFile(null)}
                >
                  <div
                    className="bg-white rounded-lg h-full w-full flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Modal Header */}
                    <div className="flex justify-between items-center p-6 border-b">
                      <div>

                        <h2 className="text-2xl font-bold text-gray-800">{selectedFile.originalName}</h2>
                        <p className="text-sm text-gray-500 mt-1">Path: {selectedFile.path}</p>
                      </div>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                      >
                        ×
                      </button>
                    </div>

                    {/* Modal Content - File Display */}
                    <div className="flex-1 w-full h-full overflow-hidden flex items-center justify-center">

                      <iframe
                        src={`${BACKEND_PORT_URL}/${selectedFile.path.replace(/\\/g, "/")}`}
                        alt="file"
                        className="w-full h-full border-0"
                        onError={(e) => {
                          e.target.src =
                            'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="50" text-anchor="middle" dy=".3em">File not found</text></svg>';
                        }}
                      />
                    </div>

                    {/* Modal Footer */}
                    <div className="p-4 border-t flex justify-between items-center">
                      <p className="text-sm text-gray-600">Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-purple-700 transition duration-200"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className='relative'>
                {/* Questions Section */}
                <h2 className="text-3xl font-bold mt-12 mb-6">Questions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-12">
                  {links && links.length > 0 ? (
                    links.map(({ lname, url }) => (
                      <div
                        key={lname}
                        className="bg-yellow-100 rounded-2xl shadow-md p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-yellow-200 transition"
                        onClick={() => window.open(url, '_blank')}
                        style={{ minHeight: '120px' }}
                      >
                        <span className="text-xl font-semibold text-gray-800">{lname}</span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500 text-lg">No questions found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>


            <form action="https://www.youtube.com/results" className="m-5 w-5/6 flex overflow-x-hidden relative bottom-8 gap-2">
              <input
                type="text"
                placeholder="Search content of youtube..."
                name='search_query'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button
                type="submit"
                className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-800 transition duration-200"
              >
                YouTube
              </button>
            </form>
          </div>} />


      </Routes>
    </>
  )
}

export default App