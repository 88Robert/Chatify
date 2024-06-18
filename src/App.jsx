import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Register from "./comp/Register";
import Login  from "./comp/Login";
import ContextProvider from "./ContextProvider/ContextProvider";
import ProtectedRoute from "./comp/utils/ProtectedRoute"
import Chat from "./comp/Chat";

function App() {
  return <>
  <ContextProvider>
  <Routes>
    <Route path="/" element={<Register />} />
    <Route path="/login" element={<Login />} />
    <Route path="/protected"
    element={
      <ProtectedRoute>
       <Chat /> 
      </ProtectedRoute>
    }
    />
  </Routes>
  </ContextProvider>
  </>;
}

export default App;
