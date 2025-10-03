import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/api";
import { useLoadingStore } from "../store/LoadingStore";

import "./style/Register.css";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const loading = useLoadingStore((state) => state.loading);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("パスワードが一致されてないです！");
      return;
    }

    if (formData.password.length < 8) {
      setError("パスワードが短いです！");
      return;
    }

    const hasLetter = /[a-zA-Z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);
    if (!hasLetter || !hasNumber) {
      setError("パスワードは必ず数字と英字両方が含めます！");
      return;
    }

    setLoading(true);

    try {
      await register(formData.username, formData.password, formData.email);
      alert("会員登録成功しました！");
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.messgae || "会員登録失敗しました！");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>E-mail</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
        <div>
          <label>ユーザー名</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
        <div>
          <label>パスワード</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
        <div>
          <label>確認パスワード</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "登録中..." : "会員登録"}
        </button>
      </form>
      {error ? <p>{error}</p> : <p></p>}
      <p>
        すでにアカウント持っています？
        <Link to="/login">ログイン</Link>
      </p>
    </div>
  );
}
