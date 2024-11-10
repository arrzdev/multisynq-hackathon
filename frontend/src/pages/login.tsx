import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const handleSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    localStorage.setItem("username", username);
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#FDF0D5] rounded-xl">
      <div className="p-10 bg-white border border-[#C1121F] rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-[#780000] text-center text-4xl font-bold mb-8">Welcome to SynqCity</h2>
        <form className="space-y-6" onSubmit={handleSubmission}>
          <div>
            <label htmlFor="username" className="block text-[#780000] text-lg font-semibold">Username</label>
            <input type="text" id="username" name="username" autoComplete="off" autoCorrect='off' autoCapitalize='off' value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-4 py-3 border border-[#C1121F] rounded-md text-lg"/>
          </div>
          <button type="submit" className="w-full bg-[#780000] text-white py-3 rounded-md text-lg font-semibold hover:bg-[#C1121F] transition-colors">Join</button>
        </form>
      </div>
    </div>
  );
}

export default Login;