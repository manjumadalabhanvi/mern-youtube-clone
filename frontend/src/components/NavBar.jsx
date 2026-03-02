import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Navbar({ setSearch }) {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  let username = null;

  if (token) {
    const decoded = jwtDecode(token);
    username = decoded.username;
  }

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/login");

  };

  return (

    <div className="flex items-center justify-between px-4 py-2 bg-black text-white border-b border-gray-800">

      {/* LEFT */}

      <h1
        className="text-xl text-red-500 font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        YouTube
      </h1>


      {/* CENTER */}

      <div className="flex items-center w-1/2">

        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-1 bg-zinc-900 border border-gray-700 rounded-l-full outline-none"
        />

        <button className="px-4 py-1 bg-zinc-800 border border-gray-700 rounded-r-full">
          🔍
        </button>

      </div>


      {/* RIGHT */}

      {token ? (

        <div className="flex items-center gap-4">

         <div className="flex items-center gap-2">

  {/* Profile Circle */}
  <div className="w-9 h-9 bg-gray-600 rounded-full flex items-center justify-center font-semibold">

    {username?.charAt(0).toUpperCase()}

  </div>

  {/* Username */}
  <span className="font-semibold text-white">
    {username}
  </span>

</div>

          <button
            onClick={handleLogout}
            className="bg-red-600 px-3 py-1 rounded"
          >
            Logout
          </button>

        </div>

      ) : (

        <div className="flex gap-4">

          <Link to="/login">
            Login
          </Link>

          <Link to="/register">
            Register
          </Link>

        </div>

      )}

    </div>

  );

}

export default Navbar;
