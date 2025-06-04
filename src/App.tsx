import { Routes, Route, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import HomePage from "./pages/HomePage";
import ChildrenPage from "./pages/ChildrenPage";
import { Link } from "react-router-dom";
import EvaluatorsPage from "./pages/EvaluatorsPage";
import EvaluationsPage from "./pages/EvaluationsPage";
;
import ChildDetail from "./pages/ChilProfilePage";
import EvaluacionPage from "./pages/EvaluationsPage";
import TestItemsPage from "./pages/TestItemPage";
import UsersPage from "./pages/UsersPage";
const { Header, Content, Footer } = Layout;

const App = () => {
  const location = useLocation();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ position: "sticky", top: 0, zIndex: 100, width: "100%" }}>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{ lineHeight: "64px" }}
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
            <Link to="/evaluators">Evaluador</Link>
          </Menu.Item>

          <Menu.Item key="/evaluations">
           <Link to="/evaluations">Evaluacion</Link>
          </Menu.Item>

          <Menu.Item key="/test-items">
            <Link to="/test-items">Test</Link>
          </Menu.Item>

        </Menu>
      </Header>

      <Content style={{ padding: "24px" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/children" element={<ChildrenPage />} />
          <Route path="/children/:id" element={<ChildDetail/>} />
          
         <Route path="/evaluators" element={<EvaluatorsPage />} />
         <Route path="/evaluations" element={<EvaluationsPage />} />
         <Route path="/evaluations/:id" element={<EvaluationsPage />} />
         <Route path="/evaluations/new/:childId" element={<EvaluacionPage />} />
         <Route path="/test-items" element={<TestItemsPage />} />
         <Route path="/users" element={<UsersPage />} />


          {/* Agrega más rutas aquí */}
        </Routes>
      </Content>

      

      <Footer style={{ textAlign: "center" }}>
        Brunet-Lézine ©2025 - Proyecto Escuela
      </Footer>
    </Layout>
  );
};

export default App;
