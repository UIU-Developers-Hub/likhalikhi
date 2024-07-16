import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Single from "./pages/Single";
import Write from "./pages/Write";

// Layout component that includes the Navbar and Footer
const Layout = () => {
  return (
    <>
      {/* Add Navbar component */}
      <Navbar />
      {/* Outlet is a placeholder for the nested route components */}
      <Outlet />
      {/* Add Footer component */}
      <Footer />
    </>
  );
};

// Define the routes using createBrowserRouter
const router = createBrowserRouter([
  {
    // Base route with a layout
    path: "/",
    element: <Layout />,
    children: [
      {
        // Home page route
        path: "/",
        element: <Home />,
      },
      {
        // Single post page route with dynamic parameter ":id"
        path: "/post/:id",
        element: <Single />,
      },
      {
        // Write post page route
        path: "/write",
        element: <Write />,
      },
      {
        // Login page route
        path: "/login",
        element: <Login />,
      },
      {
        // Register page route
        path: "/register",
        element: <Register />,
      },
    ],
  },
  
]);

// Main App component
const App = () => {
  return (
    <div>
      {/* Provide the router to the application */}
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
