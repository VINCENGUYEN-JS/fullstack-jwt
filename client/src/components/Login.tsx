import React from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../generated/graphql";
import JWTManager from "../utils/jwt";

const Login = () => {
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();
  const [login, _] = useLoginMutation();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await login({
      variables: { loginInput: { username: userName, password } },
    });
    const data = response.data?.login;
    if (data?.success && data?.accessToken) {
      JWTManager.setToken(data?.accessToken);
      navigate("..");
    }
  };
  return (
    <form style={{ marginTop: "1rem" }} onSubmit={onSubmit}>
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
