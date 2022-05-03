import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const Layout = () => {
  const { isAuthenticated, logoutClient } = useAuthContext();
  return (
    <div>
      <h1>JWT AUTHENTICATION FULLSTACK</h1>
      <nav
        style={{
          borderBottom: "1px solid",
          paddingBottom: "1rem",
        }}
      >
        <Link to="">Home</Link> |<Link to="login">Login</Link> |{" "}
        <Link to="register">Register</Link> | <Link to="profile">Profile</Link>{" "}
        | {isAuthenticated && <button onClick={logoutClient}>Log out</button>}
      </nav>
      <Outlet />
    </div>
  );
};

export default Layout;
