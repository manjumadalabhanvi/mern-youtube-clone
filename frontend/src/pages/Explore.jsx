import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Explore() {
  const [videos, setVideos] = useState([]);

  const fetchVideos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/videos");

      setVideos(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-semibold mb-6">Explore</h1>

      {/* GRID */}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <Link to={`/watch/${video._id}`} key={video._id}>
            <div className="cursor-pointer">
              {/* Thumbnail */}

              <img
                src={video.thumbnailUrl}
                className="w-full h-40 object-cover rounded-lg"
              />

              {/* Title */}

              <p className="mt-2 font-semibold">{video.title}</p>

              {/* Channel */}

              <p className="text-gray-400 text-sm">{video.user?.username}</p>

              {/* Views */}

              <p className="text-gray-400 text-sm">{video.views} views</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Explore;
