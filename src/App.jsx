import React, { useEffect, useState } from 'react'
import 'animate.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'remixicon/fonts/remixicon.css'
import "react-toastify/dist/ReactToastify.css";

const API_KEY = "YOUR_PEXELS_API_KEY";

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("nature");

  // ⭐ DOWNLOAD FUNCTION (100% WORKING)
  const downloadImage = async (url, filename) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      toast.error("Failed to download!");
    }
  };

  // Fetch Images
  const fetchImages = async () => {
    try {
      setLoading(true);

      const options = {
        headers: { Authorization: API_KEY },
      };

      const res = await axios.get(
        `https://api.pexels.com/v1/search?query=${query}&page=${page}&per_page=12`,
        options
      );

      setPhotos((prev) => [...prev, ...res.data.photos]);
    } catch (err) {
      toast.error("Failed to fetch images");
    } finally {
      setLoading(false);
    }
  };

  // Load More
  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  // Search Function
  const search = (e) => {
    e.preventDefault();
    let q = e.target.search.value.trim();
    if (!q) return;

    setPhotos([]);
    setPage(1);
    setQuery(q);
  };

  useEffect(() => {
    fetchImages();
  }, [page, query]);

  return (
    <div className='bg-gray-100 min-h-screen flex flex-col items-center py-8 gap-12 animate__animated animate__fadeIn'>

      <h1 className='text-4xl font-bold text-indigo-600'>
        📷 Image Gallery – {query}
      </h1>

      <form onSubmit={search} className='flex'>
        <input
          name="search"
          className='p-3 bg-white rounded-l-lg w-[400px] focus:outline-indigo-600'
          placeholder='Search images...'
          required
        />
        <button className='bg-gradient-to-br from-indigo-600 via-blue-500 to-indigo-600
         text-white font-bold py-3 px-8 rounded-r-lg hover:scale-105 transition-transform'>
          Search
        </button>
      </form>

      {photos.length === 0 && !loading && (
        <h1 className='text-3xl font-bold text-center text-gray-600'>
          Images not found. Try another keyword.
        </h1>
      )}

      <div className='grid lg:grid-cols-4 lg:gap-12 gap-8 w-9/12'>

        {photos.map((item, index) => (
          <div key={index} className='bg-white rounded-xl shadow'>
            <img
              src={item.src.medium}
              alt={item.alt}
              className='rounded-t-xl h-[180px] w-full object-cover hover:scale-110 transition-transform duration-300'
            />
            <div className='p-3'>
              <h1 className='text-lg text-gray-600 font-medium capitalize'>
                {item.photographer}
              </h1>

              {/* ⭐ Updated Download Button */}
              <button
                onClick={() => downloadImage(item.src.original, `image-${index}.jpg`)}
                className='mt-3 bg-green-500 font-bold py-2 rounded-lg text-center text-white w-full
                hover:scale-105 transition-transform duration-300'
              >
                <i className='ri-download-line mr-1'></i> Download
              </button>

            </div>
          </div>
        ))}

        {loading && (
          <div className="col-span-full flex justify-center">
            <i className="ri-loader-4-line text-4xl text-gray-400 animate-spin"></i>
          </div>
        )}

        {photos.length > 0 && !loading && (
          <div className="col-span-full flex justify-center">
            <button
              onClick={loadMore}
              className='bg-rose-500 py-3 px-16 rounded-lg font-medium text-white 
              hover:scale-110 transition-transform duration-300'
            >
              Load More
            </button>
          </div>
        )}

      </div>

      <ToastContainer />
    </div>
  );
};

export default App;

