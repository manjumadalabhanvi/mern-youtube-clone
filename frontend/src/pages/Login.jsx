import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({

    email: "",
    password: ""

  });

  const [error, setError] = useState("");


  const handleChange = (e) => {

    setForm({

      ...form,
      [e.target.name]: e.target.value

    });

  };


  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const res = await fetch(

        "http://localhost:5000/api/auth/login",

        {
          method: "POST",

          headers: {

            "Content-Type": "application/json"

          },

          body: JSON.stringify(form)

        }

      );


      const data = await res.json();


      if (!res.ok) {

        throw new Error(data.message || "Login failed");

      }


      // save JWT token
      localStorage.setItem("token", data.token);


      // redirect to home
      navigate("/");

    }

    catch (err) {

      setError(err.message);

    }

  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <form
        onSubmit={handleLogin}
        className="bg-zinc-900 p-8 rounded-lg w-96"
      >

        <h2 className="text-2xl mb-6 text-center font-semibold">

          Login

        </h2>


        {/* EMAIL */}

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-4 p-2 bg-zinc-800 rounded outline-none"
          required
        />


        {/* PASSWORD */}

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-4 p-2 bg-zinc-800 rounded outline-none"
          required
        />


        {/* ERROR */}

        {error && (

          <p className="text-red-500 mb-3 text-sm">

            {error}

          </p>

        )}


        {/* BUTTON */}

        <button
          className="w-full bg-red-600 py-2 rounded hover:bg-red-700"
        >

          Login

        </button>


        {/* REGISTER LINK */}

        <p className="mt-4 text-sm text-gray-400">

          Don't have account?

          <Link
            to="/register"
            className="text-blue-500 ml-1"
          >

            Register

          </Link>

        </p>

      </form>

    </div>

  );

}

export default Login;