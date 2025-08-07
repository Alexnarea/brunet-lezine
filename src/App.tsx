import { Routes, Route, useLocation, useNavigate, Link } from "react-router-dom";
import { Layout, Menu, Button } from "antd";

import HomePage from "./pages/HomePage";
import UsersPage from "./pages/UsersPage";
import ChildrenPage from "./pages/ChildrenPage";
import EvaluatorsPage from "./pages/EvaluatorsPage";
import EvaluationDetailPage from "./pages/EvaluationDetailPage";
import EvaluacionPage from "./pages/EvaluationsPage";
import TestItemsPage from "./pages/TestItemPage";
import PrivateRoute from "./routes/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import ChildDetail from "./pages/ChilProfilePage";

import AuthService from "./service/authService";

const { Header, Content, Footer } = Layout;

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = AuthService.getToken();
  const decoded = token ? AuthService.decodeToken(token) : null;

  const authoritiesRaw = decoded?.authorities;
  const roles: string[] = Array.isArray(authoritiesRaw)
    ? authoritiesRaw
    : typeof authoritiesRaw === "string"
    ? authoritiesRaw.split(",")
    : [];

  const isAdmin = roles.includes("ROLE_ADMIN");
  const isEvaluator = roles.includes("ROLE_EVALUATOR");

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {location.pathname !== "/login" && (
        <Header style={{ position: "sticky", top: 0, zIndex: 100, width: "100%", display: "flex", alignItems: "center" }}>
          <Menu theme="dark" mode="horizontal" selectedKeys={[location.pathname]} style={{ flex: 1 }}>
            <Menu.Item key="/">
              <Link to="/">Inicio</Link>
            </Menu.Item>
            {isAdmin && (
              <Menu.Item key="/users">
                <Link to="/users">Usuarios</Link>
              </Menu.Item>
            )}
            {(isAdmin || isEvaluator) && (
              <Menu.Item key="/children">
                <Link to="/children">Niños</Link>
              </Menu.Item>
            )}
            {isAdmin && (
              <Menu.Item key="/evaluators">
                <Link to="/evaluators">Evaluadores</Link>
              </Menu.Item>
            )}
            {isAdmin && (
              <Menu.Item key="/test-items">
                <Link to="/test-items">Ítems de Test</Link>
              </Menu.Item>
            )}
          </Menu>
          <Button type="primary" danger onClick={handleLogout} style={{ marginLeft: "auto" }}>
            Cerrar sesión
          </Button>
        </Header>
      )}

      <Content style={{ padding: "24px" }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Inicio */}
          <Route path="/" element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          } />

          {/* Usuarios - solo ADMIN */}
          <Route path="/users" element={
            <PrivateRoute requiredRoles={["ROLE_ADMIN"]}>
              <UsersPage />
            </PrivateRoute>
          } />

          {/* Niños - ADMIN y EVALUATOR */}
          <Route path="/children" element={
            <PrivateRoute requiredRoles={["ROLE_ADMIN", "ROLE_EVALUATOR"]}>
              <ChildrenPage />
            </PrivateRoute>
          } />
          <Route path="/children/:id" element={
            <PrivateRoute requiredRoles={["ROLE_ADMIN", "ROLE_EVALUATOR"]}>
              <ChildDetail />
            </PrivateRoute>
          } />

          {/* Evaluación - crear o editar (ambos roles) */}
          <Route path="/children/:childId/evaluation" element={
            <PrivateRoute requiredRoles={["ROLE_ADMIN", "ROLE_EVALUATOR"]}>
              <EvaluacionPage />
            </PrivateRoute>
          } />
          <Route path="/evaluations/new/:childId" element={
            <PrivateRoute requiredRoles={["ROLE_ADMIN", "ROLE_EVALUATOR"]}>
              <EvaluacionPage />
            </PrivateRoute>
          } />

          {/* Detalle de evaluación (ambos roles) */}
          <Route path="/evaluations/:id" element={
            <PrivateRoute requiredRoles={["ROLE_ADMIN", "ROLE_EVALUATOR"]}>
              <EvaluationDetailPage />
            </PrivateRoute>
          } />

          {/* Evaluadores - solo ADMIN */}
          <Route path="/evaluators" element={
            <PrivateRoute requiredRoles={["ROLE_ADMIN"]}>
              <EvaluatorsPage />
            </PrivateRoute>
          } />

          {/* Ítems de Test - solo ADMIN */}
          <Route path="/test-items" element={
            <PrivateRoute requiredRoles={["ROLE_ADMIN"]}>
              <TestItemsPage />
            </PrivateRoute>
          } />
        </Routes>
      </Content>

      <Footer style={{ textAlign: "center" }}>
        Brunet-Lézine 2025 - Mi primer Crayon
      </Footer>
    </Layout>
  );
};

export default App;
