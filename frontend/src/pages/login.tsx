import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");

  const [isSignIn, setIsSignIn] = useState(true);

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const response = await fetch(`http://localhost:3000/${isSignIn ? "signin" : "signup"}`, {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (response.ok) {
      //set the token in the local storage
      localStorage.setItem("auth-token", data.token);
      navigate("/");
      return;
    }

    setError(data.message);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#FDF0D5] rounded-xl">
      <div className="p-10 bg-white border border-[#C1121F] rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-[#780000] text-center text-4xl font-bold mb-8">{isSignIn ? "Login" : "Sign Up"}</h2>
        <form className="space-y-6" onSubmit={handleSubmission}>
          <div>
            <label htmlFor="username" className="block text-[#780000] text-lg font-semibold">Username</label>
            <input type="text" id="username" name="username" autoComplete="off" autoCorrect='off' autoCapitalize='off' value={loginData.username} onChange={handleInputChange} required className="w-full px-4 py-3 border border-[#C1121F] rounded-md text-lg"/>
          </div>
          <div>
            <label htmlFor="password" className="block text-[#780000] text-lg font-semibold">Password</label>
            <input type="password" id="password" name="password" autoComplete="off" autoCorrect='off' autoCapitalize='off' value={loginData.password} onChange={handleInputChange} required className="w-full px-4 py-3 border border-[#C1121F] rounded-md text-lg"/>
          </div>
          <button type="submit" className="w-full bg-[#780000] text-white py-3 rounded-md text-lg font-semibold hover:bg-[#C1121F] transition-colors">{isSignIn ? "Login" : "Sign Up"}</button>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </form>
        <p className="mt-6 text-center text-lg">
          {isSignIn ? "Don't have an account?" : "Already have an account?"} <button onClick={toggleForm} className="text-[#C1121F] hover:underline font-semibold">{isSignIn ? "Sign up" : "Login"}</button>
        </p>
      </div>
    </div>
  );
}

export default Login;