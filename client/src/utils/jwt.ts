import jwtDecode, { JwtPayload } from "jwt-decode";

type DataResponse = {
  success: boolean;
  accessToken: string;
};

const JWTManager = () => {
  let inMemoryToken: string | null;
  let refreshTokenTimeOutId: number | null = null;
  let userId: number | null = null;
  const getToken = () => inMemoryToken;

  const setToken = (accessToken: string) => {
    inMemoryToken = accessToken;
    const decodedToken = jwtDecode<JwtPayload & { id: number }>(accessToken);
    userId = decodedToken.id;
    setRefreshTokenTimeOut(
      (decodedToken.exp as number) - (decodedToken.iat as number)
    );
    return true;
  };

  const getUserId = () => userId;

  const abortRefreshToken = () => {
    if (refreshTokenTimeOutId) window.clearTimeout(refreshTokenTimeOutId);
  };

  const deleteToken = () => {
    inMemoryToken = null;
    abortRefreshToken();
  };

  const getRefreshToken = async () => {
    try {
      const response = await fetch("http://localhost:4000/refresh_token", {
        credentials: "include",
      });
      const data: DataResponse = await response.json();
      if (data.success) {
        abortRefreshToken();
        setToken(data.accessToken);
      }
    } catch (err) {
      deleteToken();
    }
  };

  const setRefreshTokenTimeOut = (time: number) => {
    // 5s before token expires
    refreshTokenTimeOutId = window.setTimeout(
      getRefreshToken,
      time * 1000 - 5000
    );
  };
  return {
    getToken,
    setToken,
    deleteToken,
    getRefreshToken,
    getUserId,
  };
};

export default JWTManager();
