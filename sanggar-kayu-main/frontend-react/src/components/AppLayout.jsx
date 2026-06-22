import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  LogoutOutlined,
  BellOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { Input, Button, message } from 'antd';
import "../Styles/AppLayout.css";

const API_URL = import.meta.env.VITE_API_URL;

const nav = [
    {
        path: "/dashboard",
        label: "Dashboard",
        icon: DashboardOutlined
    },
    {
        path: "/products",
        label: "Products",
        icon: ShoppingCartOutlined
    },
    {
        path: "/Pos",
        label: "POS",
        icon: FileTextOutlined
    },
    {
        path: "/transactions",
        label: "Transactions",
        icon: DatabaseOutlined
    },
    {
        path: "/user",
        label: "User",
        icon: UserOutlined
    }
];

const AppLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = async () => {
        try {
            const response = await fetch(
                `${API_URL}/logout`,
                {
                    method: "POST",
                }
            )

            const data = await response.json();
            if (data.success) {
                message.success("Logout berhasil");
                navigate("/login");
            }
        }

        catch (error) {
            console.error(error);
            message.error("Terjadi kesalahan");
        }
    }

    const getInitials = (name) => {
        if (!name) {
            return "";
        }

        const words = name.trim().split(" ");

        if (words.length === 1) {
            return words[0].charAt(0).toUpperCase();
        }

        return (
            words[0].charAt(0) +
            words[1].charAt(0)
        ).toUpperCase();
    };

    return (
        <div className="app-layout">

            {/* Sidebar */}
            <aside className="sidebar">

                {/* Logo */}
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">
                        <AppstoreOutlined size={20} />
                    </div>

                    <div>
                        <h2>Sanggar Kayu</h2>
                        <p>Inventory & POS</p>
                    </div>
                </div>

                {/* Menu */}
                <nav className="sidebar-nav">

                    {nav.map((item) => {
                       const isActive = location.pathname === item.path;
                       const Icon = item.icon;
                       
                       return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-link ${
                                isActive ? "sidebar-link-active" : ""
                                }`}
                        >
                            
                            <Icon size={18} />
                            <span>{item.label}</span>

                        </Link>
                       )
                    })}

                </nav>

                {/* User */}
                <div className="sidebar-user">

                    <div className="user-avatar">
                        {getInitials(user?.name)}
                    </div>

                    <div className="user-info">
                        <p className='user-greeting'>Welcome,</p>
                        <p className='user-name'>{user?.name || "Admin"}</p>
                    </div>

                    <Link
                        // to="/login"
                        className="logout-button"
                        onClick={() => {
                            handleLogout();
                        }}
                    >
                        <LogoutOutlined size={18} />
                    </Link>
                </div>

            </aside>

            {/* Main */}
            <div className="main-content">
                
                {/* HEADER */}
                <header className="topbar">

                    <div className="topbar-right">
                        <div className="search-wrapper">

                            <Input
                            placeholder="Search products, transactions..."
                            prefix={<SearchOutlined />}
                            className="search-input"
                            />

                        </div>

                        <Button
                            type="text"
                            className="notif-button"
                            icon={<BellOutlined size={18} />}
                        >
                            {/* <BellOutlined size={18} /> */}
                        </Button>
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main className="page-content">
                    <div className="page-inner">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
};

export default AppLayout;