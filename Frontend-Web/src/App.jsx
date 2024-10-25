import Login from "./Pages/Login";
import Home from "./Pages/Home";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./context/ProtectedRoute";
import Dashboard from "./Pages/Admin/Dashboard";
// ? FOR TESTING PURPOSES ONLY
import SampleAdminRewardsCrud from "./samples/SampleAdminRewardsCrud";
import { AuthProvider } from "./context/AuthProvider";
import Profile from "./Pages/Admin/Profile";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/profile" element={<Profile />} />
        <Route
          path="/samples/rewards/admin"
          element={<SampleAdminRewardsCrud />}
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
