import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
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


  const handleRegister = async (e) => {

    e.preventDefault();

    try {

      const res = await fetch(

        "http://localhost:5000/api/auth/register",

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

        throw new Error(data.message);

      }


      // save token
      localStorage.setItem("token", data.token);


      navigate("/");

    }

    catch (err) {

      setError(err.message);

    }

  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <form
        onSubmit={handleRegister}
        className="bg-zinc-900 p-8 rounded-lg w-96"
      >

        <h2 className="text-2xl mb-6 text-center">
          Register
        </h2>


        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full mb-4 p-2 bg-zinc-800 rounded"
          required
        />


        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-4 p-2 bg-zinc-800 rounded"
          required
        />


        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-4 p-2 bg-zinc-800 rounded"
          required
        />


        {error && (

          <p className="text-red-500 mb-3">
            {error}
          </p>

        )}


        <button
          className="w-full bg-red-600 py-2 rounded"
        >
          Register
        </button>


        <p className="mt-4 text-sm">

          Already have account?

          <Link
            to="/login"
            className="text-blue-500 ml-1"
          >
            Login
          </Link>

        </p>

      </form>

    </div>

  );

}

export default Register;