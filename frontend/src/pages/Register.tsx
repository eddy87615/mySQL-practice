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

const formFields = [
  { name: "email", label: "E-mail", type: "text" },
  { name: "username", label: "ユーザー名", type: "text" },
  { name: "password", label: "パスワード", type: "password" },
  { name: "confirmPassword", label: "パスワード確認", type: "password" },
];

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
      await register(formData.username, formData.email, formData.password);
      alert("会員登録成功しました！");
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.messgae || "会員登録失敗しました！");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page_body">
      <div className="form_wrapper">
        <h1>会員登録</h1>
        <form onSubmit={handleSubmit} className="input_form">
          {formFields.map((field) => (
            <div key={field.name} className="input_area">
              <label>{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name as keyof FormData]}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          ))}
          <button type="submit" disabled={loading}>
            {loading ? "登録中..." : "会員登録"}
          </button>
          {error ? <p>{error}</p> : <p></p>}
          <p>
            すでにアカウント持っています？
            <Link to="/login">ログイン</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
