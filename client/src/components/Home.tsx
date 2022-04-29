import React from "react";
import { useUsersQuery } from "../generated/graphql";

const Home = () => {
  const { data, loading } = useUsersQuery({ fetchPolicy: "no-cache" });
  if (loading) return <div>Loading...</div>;
  return (
    <ul style={{ listStyle: "none" }}>
      {data?.users.map((user) => (
        <li>{user.username}</li>
      ))}
    </ul>
  );
};

export default Home;
