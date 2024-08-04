import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Register from "./comp/Register";
import Login  from "./comp/Login";
import ContextProvider from "./ContextProvider/ContextProvider";
import ProtectedRoute from "./comp/utils/ProtectedRoute"
import Chat from "./comp/Chat";
import Profile from "./comp/Profile"

function App() {
  return <>
  <ContextProvider>
  <Routes>
    <Route path="/" element={<Register />} />
    <Route path="/login" element={<Login />} />
    <Route path="/chat"
    element={
      <ProtectedRoute>
       <Chat /> 
      </ProtectedRoute>
    }
    />
      <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
  </Routes>
  </ContextProvider>
  </>;
}

export default App;
