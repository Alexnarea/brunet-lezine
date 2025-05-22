import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ChildrenPage from "../pages/ChildrenPage";
import LoginPage from "../pages/LoginPage";
import EvaluatorsPage from "../pages/EvaluatorsPage";


const AppRouter = () => {
  const isAuthenticated = true; // Aquí podrías usar un contexto de auth

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
      <Route path="/children" element={<ChildrenPage />} />
      <Route path="/Evaluators" element={<EvaluatorsPage/>}/>
      {/* Agrega más rutas aquí */}
    </Routes>
  );
};

export default AppRouter;
