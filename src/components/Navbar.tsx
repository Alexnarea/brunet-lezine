import React from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

const { Header } = Layout;

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
      <div className="logo" style={{ float: "left", color: "white", fontWeight: "bold", fontSize: 20 }}>
        Brunet-Lézine
      </div>
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
        <Menu.Item key="/evaluations">
          <Link to="/evaluations">Evaluaciones</Link>
        </Menu.Item>
        <Menu.Item key="/results">
          <Link to="/results">Resultados</Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default Navbar;
