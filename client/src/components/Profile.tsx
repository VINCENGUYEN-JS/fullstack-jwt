import React from "react";
import { useHelloQuery } from "../generated/graphql";

const Profile = () => {
  const { data, error, loading } = useHelloQuery({ fetchPolicy: "no-cache" });
  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error: {error.message}</h2>;
  return <div>{data?.hello}</div>;
};

export default Profile;
