import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  LogoutOutlined,
  BellOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import { Input, Button } from 'antd';
import "../styles/AppLayout.css";

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
];

const AppLayout = () => {
    const location = useLocation();

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
                        AD
                    </div>

                    <div className="user-info">
                        <p className='user-name'>Admin</p>
                        <p className='user-email'>admin@example.com</p>
                    </div>

                    <Link
                        to="/login"
                        className="logout-button"
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