import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface AuthCheck {
  isAuthenticated: boolean
}

const Login: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get<AuthCheck>('/auth/check-auth')
      .then((response) => {
        if (response.data.isAuthenticated) {
          navigate('/home');
        }
      })
      .catch((err: Error) => err);
  }, [navigate]);

  const handleGoogleLogin = () => {
    window.location.href = '/auth/google';
  };

  return (
    <div>
      <h1>Login Here</h1>
      <button
        type="button"
        onClick={handleGoogleLogin}
      >
        Login with Google
      </button>
    </div>
  );
};

export default Login;
