import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Posts from "./pages/Posts";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import SinglePost from "./pages/SinglePost";
import VerifyEmail from "./pages/VerifyEmail"; // Adjust the path as needed
import WritePost from "./pages/WritePost";
import PrivateRoute from "./utils/PrivateRoute";

const App = () => {
  return (
    <div className="bg-white dark:bg-cusDarkBG min-h-screen">
      <Router>
        <Routes>
          {/* Routes outside of the main layout */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Main layout with nested routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="posts" element={<Posts />} />
            <Route path="post/:id" element={<SinglePost />} />
            <Route
              path="create-post"
              element={<PrivateRoute element={<WritePost />} />}
            />
            <Route
              path="profile/:id"
              element={<PrivateRoute element={<Profile />} />}
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
