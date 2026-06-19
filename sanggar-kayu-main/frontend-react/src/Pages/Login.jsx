import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { LoginOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import "../App.css";
import "../Styles/Login.css";

const { Title, Text } = Typography;

const API_URL = import.meta.env.VITE_API_URL;

const Index = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async  (values) => {
    // console.log("Masuk onFinish!")
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      )

      const data = await response.json();
      console.log("Data", data);

      if (!data.success) {
        message.error(data.message);
        return;
      }

      message.success(data.message);
      console.log(data.user);
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );
      navigate("/dashboard");
    }
    
    catch (error){
      console.error(error);
      message.error("Terjadi kesalahan");
    }
    
    finally {
    setLoading(false);
    }
  } 

  return (
    <main className="main-container">
      <Card className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <LoginOutlined className="login-icon-svg" />
          </div>
          <Title level={3} className="login-title">
            Selamat Datang
          </Title>
          <Text type="secondary" className="login-subtitle">
            Masuk ke akun Anda untuk melanjutkan
          </Text>
        </div>

        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Mohon masukkan username" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Masukkan username"
              autoComplete="username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Mohon masukkan password" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Masukkan password"
              autoComplete="current-password"
              size="large"
            />
          </Form.Item>

          <Form.Item className="login-button-wrapper">
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </main>
  );
};

export default Index;