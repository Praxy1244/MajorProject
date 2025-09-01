import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/forgot-password`, { email });
      setMsg(res.data.message || "Check your email for a reset link");
    } catch (err) {
      setMsg(err.response?.data?.error || "Error");
    }
  };

  return (
    <form onSubmit={submit}>
      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required />
      <button type="submit">Send reset link</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
