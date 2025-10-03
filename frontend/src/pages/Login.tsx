import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";
import { useLoadingStore } from "../store/LoadingStore";

import "./style/Login.css";

interface FormData {
  username: string;
  password: string;
}

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const loading = useLoadingStore((state) => state.loading);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(username, password);
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "ログイン失敗！");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page_body">
      <div className="page_body_frame">
        <div className="form_wrapper">
          <h1>GoShoppingへようこそ！</h1>
          <h2>ログイン</h2>
          <form onSubmit={handleSubmit} className="input_form">
            <div className="input_area">
              <label>ユーザー名</label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="input_area">
              <label>パスワード</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "ログイン中..." : "ログイン"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <p>
              アカウント持っていませんか？
              <Link to="/register">会員登録</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
