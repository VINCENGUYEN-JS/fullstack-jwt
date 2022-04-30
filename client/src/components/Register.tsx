import React from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../generated/graphql";

const Register = () => {
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();

  const [register, _] = useRegisterMutation();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await register({
      variables: { registerInput: { username: userName, password } },
    });
    navigate("..");
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
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
