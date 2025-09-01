import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/reset-password/${token}`, { password });
      setMsg("Password updated — you can now log in");
      setTimeout(()=>navigate("/login"), 1500);
    } catch (err) {
      setMsg(err.response?.data?.error || "Error");
    }
  };

  return (
    <form onSubmit={submit}>
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="New password" required />
      <button type="submit">Set new password</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
