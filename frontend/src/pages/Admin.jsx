import React, { useState, useEffect } from 'react'
const BACKEND_PORT_URL = import.meta.env.BACKEND_PORT_URL || 'http://localhost:5000';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Note from '../component/Note'

function Admin() {
  const [links, setLinks] = useState([]);
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [notice, setNotice] = useState('')
  const [noticeMessage, setNoticeMessage] = useState('')
  const [noticeLoading, setNoticeLoading] = useState(false)
  const [files, setFiles] = useState([])
  const [notices, setNotices] = useState([])
  const [link, setLink] = useState("");
  const [linkName, setLinkName] = useState("");
  const [linkMessage, setLinkMessage] = useState("");
  const [linkLoading, setLinkLoading] = useState(false);
  const [navOpen, setNavOpen] = useState(false);




  // Fetch links from backend
  const fetchLinks = async () => {
    try {
      const res = await fetch(`${BACKEND_PORT_URL}/Links`);
      const data = await res.json();
      if (res.ok) {
        setLinks(data.links);
      }
    } catch (err) {
      console.log('Error fetching links:', err);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  // After uploading a link, refresh the list
  const refreshLinksAfterUpload = () => {
    fetchLinks();
  };
  // Handler to upload Google Form link
  const handleLinkUpload = async (e) => {
    e.preventDefault();
    if (!link.trim() || !linkName.trim()) {
      setLinkMessage("Please enter both link and link name");
      return;
    }
    setLinkLoading(true);
    setLinkMessage("");
    try {
      const response = await fetch(`${BACKEND_PORT_URL}/links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: link, lname: linkName })
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setLinkMessage("Link uploaded successfully!");
        setLink("");
        setLinkName("");
        refreshLinksAfterUpload();
      } else {
        setLinkMessage(data.message || "Failed to upload link");
      }

    } catch (err) {
      setLinkMessage("Error uploading link: " + err.message);
    } finally {
      setLinkLoading(false);
    }
  };

  // Delete link handler
  const handleLinkDelete = async (id) => {
    try {
      const response = await fetch(`${BACKEND_PORT_URL}/Links/${id}`, {
        method: "DELETE"
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        fetchLinks();
      }
    } catch (error) {
      console.error(error);
    }
  };


  // Removed misplaced code outside function
  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    if (!notice.trim()) {
      setNoticeMessage('Please enter a notice');
      return;
    }
    setNoticeLoading(true);
    try {
      const response = await fetch(`${BACKEND_PORT_URL}/notices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: notice })
      });
      const data = await response.json();
      if (response.ok) {
        setNoticeMessage('Notice posted successfully!');
        setNotice('');
        fetchNotices();
      } else {
        setNoticeMessage(data.message || 'Failed to post notice');
      }
    } catch (err) {
      setNoticeMessage('Error posting notice: ' + err.message);
    } finally {
      setNoticeLoading(false);
    }
  };
  // Fetch notices from backend
  const fetchNotices = async () => {
    try {
      const res = await fetch(`${BACKEND_PORT_URL}/notices`);
      const data = await res.json();
      if (res.ok) {
        setNotices(data.notices);
      }
    } catch (err) {
      console.log('Error fetching notices:', err);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message]);


  //   useEffect(() => {
  //   fetchFiles();
  // }, []);

  // const fetchFiles = async () => {
  //   try {
  //     const res = await axios.get("http://localhost:5000/files");
  //     setFiles(res.data.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // fetchFiles();

  // if (response.ok) {
  //   setMessage('File uploaded successfully!');
  //   setFile(null);
  //   setFileName('');
  //   fetchFiles(); // ✅ refresh
  // }


  // //delete handeler
  // const handleDelete = async (id) => {
  //   if (!window.confirm("Delete this file?")) return;

  //   try {
  //     await axios.delete(`http://localhost:5000/files/${id}`);
  //     fetchFiles();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };


  const navigate = useNavigate()

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`${BACKEND_PORT_URL}/files`)
      setFiles(res.data.data)
    } catch (err) {
      console.log(err)
    }
  }



  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFileName(selectedFile.name)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file first");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${BACKEND_PORT_URL}/uploads`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("File uploaded successfully!");
        setFile(null);
        setFileName("");
        fetchFiles(); // ✅ refresh list
      } else {
        setMessage(data.message || "Upload failed");
      }
    } catch (err) {
      setMessage("Error uploading file: " + err.message);
    } finally {
      setUploading(false);
    }
  };


  // Delete notice handler
  const handleNoticeDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    try {
      const res = await fetch(`${BACKEND_PORT_URL}/notices/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchNotices();
      }
    } catch (err) {
      console.log('Error deleting notice:', err);
    }
  };

  //   const handleUpload = async (e) => {
  //     e.preventDefault()
  //     if (!file) {
  //       setMessage('Please select a file first')
  //       return
  //     }

  //     setUploading(true)
  //     const formData = new FormData()
  //     formData.append('file', file)
  //     // axios.post('http://localhost:5000/upload', formData)
  //     //  .then(res => console.log(res))
  //     //  .catch(err => console.error(err))


  // //     try {
  // //   const res = await axios.post("http://localhost:5000/upload", formData);
  // //   console.log(res.data);
  // // } catch (err) {
  // //   console.log(err.response?.data || err.message);
  // // }

  //     try {
  //       const response = await fetch('http://localhost:5000/upload', {
  //         method: 'POST',
  //         body: formData,


  //       })


  //       const data = await response.json()

  //       if (response.ok) {
  //         setMessage('File uploaded successfully!')
  //         setFile(null)
  //         setFileName('')
  //       } else {
  //         setMessage(data.message || 'Upload failed')
  //       }
  //     } catch (err) {
  //       setMessage('Error uploading file: ' + err.message)
  //     } finally {
  //       setUploading(false)
  //     }
  //   }

  // const handleNoticeSubmit = async (e) => {
  //   e.preventDefault()
  //   if (!notice.trim()) {
  //     setNoticeMessage('Please enter a notice')
  //     return
  //   }

  //   setNoticeLoading(true)

  //   try {
  //     const response = await fetch('http://localhost:5000/notice', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ notice }),
  //     })

  //     const data = await response.json()

  //     if (response.ok) {
  //       setNoticeMessage('Notice posted successfully!')
  //       setNotice('')
  //     } else {
  //       setNoticeMessage(data.message || 'Failed to post notice')
  //     }
  //   } catch (err) {
  //     setNoticeMessage('Error posting notice: ' + err.message)
  //   } finally {
  //     setNoticeLoading(false)
  //   }
  // }


  const handleDelete = async (id) => {
    if (!window.confirm("Delete this file?")) return

    try {
      await axios.delete(`${BACKEND_PORT_URL}/files/${id}`)
      fetchFiles()
    } catch (err) {
      console.log(err)
    }
  }


  return (
    <div>
      <nav className="bg-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
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
            <button className="bg-red-600 h-12 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition duration-200"
              onClick={() => navigate('/')}>Home</button>
            <button className="bg-red-600 h-12 text-white font-semibold py-2 px-6 rounded-lg mr-4 hover:bg-red-700 transition duration-200"
              onClick={() => navigate('/login')}>Logout</button>
          </div>
        </div>
        {/* Mobile dropdown menu */}
        {navOpen && (
          <div className="md:hidden bg-purple-700 px-4 py-2 flex flex-col gap-2">
            <button className="bg-red-600 h-12 text-white w-full font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition duration-200"
              onClick={() => { navigate('/'); setNavOpen(false); }}>Home</button>
            <button className="bg-red-600 h-12 text-white font-semibold py-2 px-6 rounded-lg mr-4 w-full hover:bg-red-700 transition duration-200"
              onClick={() => { navigate('/login'); setNavOpen(false); }}>Logout</button>
          </div>
        )}
      </nav>

      {/* Note component for notice preview */}
      {/* <Note name={
        <ul className="list-disc pl-5 space-y-2">
          {notices.map((item) => (
            <li key={item._id} className="text-gray-800 flex justify-between items-center">
              <span>{item.text}</span>
              <button
                className="ml-4 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                onClick={() => handleNoticeDelete(item._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      } /> */}

      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex gap-10 flex-col items-center">
          {/* Left Side - Notice Form */}
          <div className="w-full ">
            <h2 className="text-3xl font-bold mb-6">Post Notice</h2>
            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
              <form onSubmit={handleNoticeSubmit} className="space-y-4">
                <div>
                  <label htmlFor="notice" className="block text-sm font-medium text-gray-700 mb-2">Notice</label>
                  <textarea
                    id="notice"
                    value={notice}
                    onChange={(e) => setNotice(e.target.value)}
                    placeholder="Write your notice here..."
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <button
                  type="submit"
                  disabled={noticeLoading}
                  className="w-full bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-purple-700 transition duration-200 disabled:bg-gray-400"
                >
                  {noticeLoading ? "Posting..." : "Post Notice"}
                </button>
              </form>
            </div>
          </div>
          {/* Right Side - Notice List */}
          <div className="w-full mb-7">
            <h2 className="text-3xl font-bold mb-6">Notice List</h2>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              {notices.length === 0 ? (
                <p className="text-gray-500">No notices posted yet.</p>
              ) : (
                <ul className="list-disc pl-5 space-y-2">
                  {notices.map((item) => (
                    <li key={item._id} className="text-gray-800 flex justify-between items-center">
                      <span>{item.text}</span>
                      <button
                        className="ml-4 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                        onClick={() => handleNoticeDelete(item._id)}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        {/* Upload Documents Section */}
        <h2 className="text-3xl font-bold mb-6">Upload Documents</h2>
        <div className="bg-white rounded-lg  shadow-md p-8 border border-gray-200 max-w-full">
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center hover:border-purple-600 transition">
              <label className="cursor-pointer">
                <div className="space-y-2">
                  <svg className="mx-auto h-12 w-12 text-purple-600" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-4-8v8m0 0l-3-3m3 3l3-3M8 20h32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-gray-700 font-semibold">Click to upload or drag and drop</p>
                  <p className="text-gray-500 text-sm">PNG, JPG, PDF, DOC or any file up to 10MB</p>
                </div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt"
                />
              </label>
            </div>
            {fileName && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-gray-700">
                  <span className="font-semibold">Selected file:</span> {fileName}
                </p>
              </div>
            )}
            {message && (
              <div className={`p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}
            <button
              type="submit"
              disabled={!file || uploading}
              className="w-full bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-purple-700 transition duration-200 disabled:bg-gray-400"
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </form>
        </div>
        {/* <button className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition duration-200 absolute right-2 top-2"
          onClick={() => navigate('/login')} >logout</button> */}
        <h2 className="text-3xl font-bold mt-12 mb-6">Uploaded Files</h2>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 max-w-full">
          {files.length === 0 && <p>No files uploaded yet.</p>}
          {files?.filter(Boolean).map((file) => (
            <div
              key={file._id}
              className="flex justify-between items-center border-b py-2"
            >
              <span className="text-red-700 ">{file.originalName}</span>
              <button
                onClick={() => handleDelete(file._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Link Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 max-w-full mt-8">
          <h2 className="text-2xl font-bold mb-4">Upload Link</h2>
          <form onSubmit={handleLinkUpload} className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center mb-4">
            <input
              type="text"
              placeholder="Enter link name..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 w-full sm:w-40"
              value={linkName}
              onChange={e => setLinkName(e.target.value)}
              required
            />
            <input
              type="url"
              placeholder="Paste your link here..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 w-full"
              value={link}
              onChange={e => setLink(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={linkLoading}
              className="bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-purple-700 transition duration-200 disabled:bg-gray-400 w-full sm:w-64"
            >
              {linkLoading ? "Uploading..." : "Upload Link"}
            </button>
          </form>
          {linkMessage && (
            <div className={`mt-2 p-3 rounded-lg ${linkMessage.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {linkMessage}
            </div>
          )}
          {/* List of Links */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Links List</h3>
            {links.length === 0 ? (
              <p className="text-gray-500">No links uploaded yet.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {links.map((item) => (
                  <li key={item._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 gap-2">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline font-medium break-all">
                      {item.lname}
                    </a>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs w-full sm:w-auto"
                      onClick={() => handleLinkDelete(item._id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;