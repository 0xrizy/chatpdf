import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Chat from "./pages/Chat"

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route  path="/" element={<Home />}></Route>
        <Route  path="/chatpdf" element={<Chat />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
