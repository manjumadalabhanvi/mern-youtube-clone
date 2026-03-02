import { Routes, Route } from "react-router-dom";
import Watch from "./pages/watch";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/register";
import Explore from "./pages/Explore";

function App() {

  const [search, setSearch] = useState("");

  return (
    <>

      <Navbar setSearch={setSearch} />

      <Routes>

        <Route
          path="/"
          element={<Home search={search} />}
        />

        <Route
          path="/watch/:id"
          element={<Watch search={search} />}
        />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/explore" element={<Explore />} />
      </Routes>

    </>
  );
}

export default App;