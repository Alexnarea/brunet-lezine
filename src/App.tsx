import { Routes, Route, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import HomePage from "./pages/HomePage";
import ChildrenPage from "./pages/ChildrenPage";
import { Link } from "react-router-dom";
import EvaluatorsPage from "./pages/EvaluatorsPage";
import EvaluationsPage from "./pages/EvaluationsPage";
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
          <Menu.Item key="/children">
            <Link to="/children">Niños</Link>
          </Menu.Item>
          <Menu.Item key="/Evaluators">
            <Link to="/Evaluator">Evaluador</Link>
          </Menu.Item>
          <Menu.Item key="/Evaluation">
            <Link to="/Evaluation">Evaluacion</Link>
          </Menu.Item>
        </Menu>
      </Header>

      <Content style={{ padding: "24px" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/children" element={<ChildrenPage />} />
          <Route path="/Evaluator" element={<EvaluatorsPage/>} />
          <Route path="/Evaluation" element={<EvaluationsPage/>} />
        </Routes>
      </Content>

      

      <Footer style={{ textAlign: "center" }}>
        Brunet-Lézine ©2025 - Proyecto Escuela
      </Footer>
    </Layout>
  );
};

export default App;
