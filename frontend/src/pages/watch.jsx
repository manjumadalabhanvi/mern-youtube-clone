import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Watch({ search }) {

  const { id } = useParams();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [sideVideos, setSideVideos] = useState([]);

  const [newComment, setNewComment] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  const token = localStorage.getItem("token");

  let currentUserId = null;

  if (token) {
    const decoded = jwtDecode(token);
    currentUserId = decoded.id;
  }


  // ✅ Fetch Video
  const fetchVideo = async () => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/videos/${id}`
      );

      setVideo(res.data);

      setSubscribed(
        res.data.user?.subscribers?.some(
          (uid) => uid.toString() === currentUserId
        )
      );

      setSubscriberCount(
        res.data.user?.subscribers?.length || 0
      );

    } catch (err) {

      console.log(err);

    }

  };


  // ✅ Fetch Side Videos
  const fetchSideVideos = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/videos"
      );

      const filtered = res.data
        .filter((v) => v._id !== id)
        .filter((v) =>
          v.title.toLowerCase().includes(search.toLowerCase())
        );

      setSideVideos(filtered);

    } catch (err) {

      console.log(err);

    }

  };


  // ✅ Fetch Comments
  const fetchComments = async () => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/comments/${id}`
      );

      setComments(res.data);

    } catch (err) {

      console.log(err);

    }

  };


  // ✅ Increase view
  useEffect(() => {

    axios.put(
      `http://localhost:5000/api/videos/view/${id}`
    );

  }, [id]);


  useEffect(() => {

    fetchVideo();
    fetchComments();
    fetchSideVideos();

  }, [id, search]);


  // ✅ Add Comment
  const handleAddComment = async (e) => {

    e.preventDefault();

    if (!newComment.trim()) return;

    try {

      await axios.post(

        "http://localhost:5000/api/comments",

        {
          text: newComment,
          videoId: id,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNewComment("");
      fetchComments();

    } catch (err) {

      console.log(err);

    }

  };


  // ✅ Delete Comment
  const handleDeleteComment = async (commentId) => {

    try {

      await axios.delete(

        `http://localhost:5000/api/comments/${commentId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchComments();

    } catch (err) {

      console.log(err);

    }

  };


  // ✅ Like Video
  const handleLike = async () => {

    try {

      await axios.put(

        `http://localhost:5000/api/videos/like/${id}`,

        {},

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchVideo();

    } catch (err) {

      console.log(err);

    }

  };


  // ✅ Dislike Video
  const handleDislike = async () => {

    try {

      await axios.put(

        `http://localhost:5000/api/videos/dislike/${id}`,

        {},

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchVideo();

    } catch (err) {

      console.log(err);

    }

  };


  // ✅ Subscribe
  const handleSubscribe = async () => {

    try {

      const res = await axios.put(

        `http://localhost:5000/api/auth/subscribe/${video.user._id}`,

        {},

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSubscriberCount(res.data.subscribers);

      setSubscribed(!subscribed);

    } catch (err) {

      console.log(err);

    }

  };


  if (!video) {

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );

  }


  const isLiked = video.likes?.includes(currentUserId);
  const isDisliked = video.dislikes?.includes(currentUserId);


  return (

    <div className="min-h-screen bg-black text-white flex justify-center gap-6 px-6">


      {/* LEFT SIDE */}
      <div className="w-full max-w-4xl py-6">


        {/* ✅ VIDEO WITH THUMBNAIL */}
        <video
          className="w-full rounded-xl mb-4"
          controls
          poster={video.thumbnailUrl}
        >
          <source src={video.videoUrl} type="video/mp4" />
        </video>


        {/* TITLE */}
        <h1 className="text-xl font-semibold mb-2">
          {video.title}
        </h1>
<p className="text-gray-300 mb-4 whitespace-pre-line">
  {video.description}
</p>

        {/* CHANNEL */}
        <div className="flex justify-between items-center mb-4">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              {video.user?.username?.charAt(0).toUpperCase()}
            </div>

            <div>
              <p>{video.user?.username}</p>

              <p className="text-gray-400 text-sm">
                {subscriberCount} subscribers
              </p>
            </div>

          </div>


          <button
            onClick={handleSubscribe}
            className={`px-4 py-2 rounded-full ${subscribed ? "bg-gray-600" : "bg-red-600"}`}
          >
            {subscribed ? "Subscribed" : "Subscribe"}
          </button>

        </div>


        {/* LIKE */}
        <div className="flex gap-4 mb-4">

          <button
            onClick={handleLike}
            className={isLiked ? "bg-blue-600 px-3 py-1 rounded" : "bg-zinc-800 px-3 py-1 rounded"}
          >
            👍 {video.likes.length}
          </button>

          <button
            onClick={handleDislike}
            className={isDisliked ? "bg-blue-600 px-3 py-1 rounded" : "bg-zinc-800 px-3 py-1 rounded"}
          >
            👎 {video.dislikes.length}
          </button>

        </div>


        {/* COMMENTS */}
        <h2 className="mb-3">
          {comments.length} Comments
        </h2>


        <form onSubmit={handleAddComment}>

          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="bg-zinc-800 p-2 w-full"
            placeholder="Add comment"
          />

        </form>


        {comments.map((c) => (

          <div key={c._id} className="mt-4 flex gap-3">

            <div className="w-9 h-9 bg-gray-600 rounded-full flex items-center justify-center">
              {c.userId?.username?.charAt(0).toUpperCase()}
            </div>

            <div>

              <p className="text-blue-400">
                {c.userId?.username}
              </p>

              <p>{c.text}</p>


              {c.userId?._id === currentUserId && (

                <button
                  onClick={() => handleDeleteComment(c._id)}
                  className="text-red-500 text-sm"
                >
                  delete
                </button>

              )}

            </div>

          </div>

        ))}

      </div>


      {/* RIGHT SIDE */}
      <div className="w-80 py-6 hidden lg:block">


        {sideVideos.map((vid) => (

          <Link key={vid._id} to={`/watch/${vid._id}`}>

            <div className="flex gap-3 mb-4">

              {/* ✅ THUMBNAIL IMAGE */}
              <img
                src={vid.thumbnailUrl}
                className="w-40 h-24 object-cover rounded"
              />

              <div>

                <p className="text-sm">
                  {vid.title}
                </p>
                

                <p className="text-xs text-gray-400">
                  {vid.user?.username}
                </p>

                <p className="text-xs text-gray-400">
                  {vid.views} views
                </p>

              </div>

            </div>

          </Link>

        ))}

      </div>


    </div>

  );

}

export default Watch;