//utils/login_auth.tsx

import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const Login_auth = () => {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    axios.get("/profile/me", { withCredentials: true })
      .then((res) => setAuthed(true))
      .catch(() => setAuthed(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!authed) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default Login_auth;