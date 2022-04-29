import React from "react";

const Register = () => {
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
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
