import React from "react";

const Login = () => {
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  return (
    <form style={{ marginTop: "1rem" }}>
      <input
        type="text"
        value={userName}
        placeholder="UserName"
        onChange={(event) => {
          setUserName(event.target.value);
        }}
      />
      <input
        type="password"
        value={password}
        placeholder="Password"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
