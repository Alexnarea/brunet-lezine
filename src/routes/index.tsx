import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ChildrenPage from "../pages/ChildrenPage";
import LoginPage from "../pages/LoginPage";
import EvaluatorsPage from "../pages/EvaluatorsPage";
import TestItemsPage from "../pages/TestItemPage";
import UsersPage from "../pages/UsersPage";


const AppRouter = () => {
  const isAuthenticated = true; // Aquí podrías usar un contexto de auth

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
      <Route path="/children" element={<ChildrenPage />} />
      <Route path="/Evaluators" element={<EvaluatorsPage/>}/>
      <Route path="/Evaluations" element={<div>Evaluaciones</div>} />
      <Route path="/children/:id" element={<div>Detalle del niño</div>} />
      <Route path="/evaluations/:id" element={<div>Detalle de la evaluación</div>} />
      <Route path="/test-items" element={<TestItemsPage />} /> 
      <Route path="/users" element={<UsersPage />} /> 

      
      {/* Agrega más rutas aquí */}
    </Routes>
  );
};

export default AppRouter;
