import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Register from "./comp/Register";
import Login  from "./comp/Login";
import ContextProvider from "./ContextProvider/ContextProvider";

function App() {
  return <>
  <ContextProvider>
  <Routes>
    <Route path="/" element={<Register />} />
    <Route path="/login" element={<Login />} />
  </Routes>
  </ContextProvider>
  </>;
}

export default App;
