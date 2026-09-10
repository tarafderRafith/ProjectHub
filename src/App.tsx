import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home/Home";
import Projects from "./pages/Projects/Projects";
import Requests from "./pages/Requests/Requests";
import ProjectDetails from "./pages/ProjectDetails/ProjectDetails";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";
import SellerProjectCreate from "./pages/SellerProjectCreate/CreateProject";
import SellerProjectEdit from "./pages/SellerProjectEdit/SellerProjectEdit";
import Payment from "./pages/Payment/Payment";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/projects"
          element={<Projects />}
        />

        <Route
          path="/projects/:id"
          element={<ProjectDetails />}
        />

        <Route
          path="/requests"
          element={<Requests />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/seller/projects/create"
          element={<SellerProjectCreate />}
        />

        <Route
          path="/seller/projects/:id/edit"
          element={<SellerProjectEdit />}
        />

        <Route
          path="/payment/:orderId"
          element={<Payment />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;