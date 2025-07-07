import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import { Link } from "react-router-dom";

import HomePage from "./pages/HomePage";
import UsersPage from "./pages/UsersPage";
import ChildrenPage from "./pages/ChildrenPage";
import ChildDetail from "./pages/ChilProfilePage";
import EvaluatorsPage from "./pages/EvaluatorsPage";
import EvaluationsListPage from "./pages/EvaluationsListPage";
import EvaluationDetailPage from "./pages/EvaluationDetailPage";
import EvaluacionPage from "./pages/EvaluationsPage";
import TestItemsPage from "./pages/TestItemPage";
import PrivateRoute from "./routes/PrivateRoute";
import LoginPage from "./pages/LoginPage";

import AuthService from "./service/authService";

const { Header, Content, Footer } = Layout;

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();  // limpia el token
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {location.pathname !== "/login" && (
        <Header style={{ position: "sticky", top: 0, zIndex: 100, width: "100%", display: "flex", alignItems: "center" }}>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            style={{ flex: 1, lineHeight: "64px" }}
          >
            <Menu.Item key="/">
              <Link to="/">Inicio</Link>
            </Menu.Item>
            <Menu.Item key="/users">
              <Link to="/users">Usuarios</Link>
            </Menu.Item>
            <Menu.Item key="/children">
              <Link to="/children">Niños</Link>
            </Menu.Item>
            <Menu.Item key="/evaluators">
              <Link to="/evaluators">Evaluadores</Link>
            </Menu.Item>
            <Menu.Item key="/evaluations">
              <Link to="/evaluations">Evaluaciones</Link>
            </Menu.Item>
            <Menu.Item key="/test-items">
              <Link to="/test-items">Ítems de Test</Link>
            </Menu.Item>
          </Menu>
          <Button
            type="primary"
            danger
            onClick={handleLogout}
            style={{ marginLeft: "auto" }}
          >
            Cerrar sesión
          </Button>
        </Header>
      )}

      <Content style={{ padding: "24px" }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute requiredRole="ROLE_ADMIN"><UsersPage /></PrivateRoute>} />
          <Route path="/children" element={<PrivateRoute><ChildrenPage /></PrivateRoute>} />
          <Route path="/children/:id" element={<PrivateRoute><ChildDetail /></PrivateRoute>} />
          <Route path="/children/:childId/evaluation" element={<PrivateRoute><EvaluacionPage /></PrivateRoute>} />
          <Route path="/evaluators" element={<PrivateRoute requiredRole="ROLE_ADMIN"><EvaluatorsPage /></PrivateRoute>} />
          <Route path="/evaluations" element={<PrivateRoute><EvaluationsListPage /></PrivateRoute>} />
          <Route path="/evaluations/:id" element={<PrivateRoute><EvaluationDetailPage /></PrivateRoute>} />
          <Route path="/evaluations/new/:childId" element={<PrivateRoute><EvaluacionPage /></PrivateRoute>} />
          <Route path="/test-items" element={<PrivateRoute><TestItemsPage /></PrivateRoute>} />
        </Routes>
      </Content>

      <Footer style={{ textAlign: "center" }}>
        Brunet-Lézine 2025 - Mi primer Crayon
      </Footer>
    </Layout>
  );
};

export default App;
