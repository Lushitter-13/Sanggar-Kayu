import { useState } from "react";
import { Card, Button, Tag, Table, Form, Modal, Input, Select, Switch } from "antd";

import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

import "../Styles/User.css";

const user = JSON.parse(localStorage.getItem("user")) || {
  id: 1,
  name: "Wilson Anjay",
  username: "wilsonanjay",
  password: "12345",
  role: 1,
  is_active: 1,
  created_at: "2026-05-14 09:52:17",
};

const users = [
  {
    id: 1,
    name: "Wilson Anjay",
    username: "wilsonanjay",
    password: "12345",
    role: 1,
    is_active: 1,
    created_at: "2026-05-14 09:52:17",
  },
  {
    id: 2,
    name: "Budi",
    username: "budi",
    password: "12345",
    role: 2,
    is_active: 0,
    created_at: "2026-05-14 09:52:17",
  },
  {
    id: 3,
    name: "Andi",
    username: "andi",
    password: "12345",
    role: 3,
    is_active: 1,
    created_at: "2026-05-14 09:52:17",
  },
];

// Dummy Data
const roles = [
  {
    id: 1,
    label: "Super Admin",
    description: "Akses penuh ke seluruh modul aplikasi",
  },
  {
    id: 2,
    label: "Admin",
    description: "Mengelola inventory dan transaksi",
  },
  {
    id: 3,
    label: "Cashier",
    description: "Hanya mengakses POS dan transaksi",
  },
];

const permissions = [
  {
    key: "dashboard.view",
    label: "Lihat Dashboard",
    description: "Akses ringkasan operasional & laporan harian.",
    roles: {
      1: true,
      2: true,
      3: false,
    },
  },
  {
    key: "pos.use",
    label: "Gunakan Kasir/POS",
    description: "Membuat transaksi penjualan dan checkout.",
    roles: {
      1: true,
      2: true,
      3: true,
    },
  },
  {
    key: "tx.view",
    label: "Lihat Riwayat Transaksi",
    description: "Membuka log transaksi & detail invoice.",
    roles: {
      1: true,
      2: true,
      3: true,
    },
  },
  {
    key: "inv.view",
    label: "Lihat Inventory",
    description: "Melihat stok produk.",
    roles: {
      1: true,
      2: true,
      3: false,
    },
  },
  {
    key: "prod.manage",
    label: "Kelola Produk",
    description: "Tambah, edit, hapus produk.",
    roles: {
      1: true,
      2: true,
      3: false,
    },
  },
  {
    key: "users.manage",
    label: "Kelola User",
    description: "Tambah, edit, hapus user.",
    roles: {
      1: true,
      2: false,
      3: false,
    },
  },
];

const Profile = () => {
  const [selectedRole, setSelectedRole] = useState(1);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [form] = Form.useForm();

  // Bikin inisial nama bwt avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .slice(0, 2)
      .map((x) => x[0])
      .join("")
      .toUpperCase();
  };

  const getRoleLabel = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.label : "-";
  };

  const getRoleClass = (roleId) => {
    switch (roleId) {
      case 1:
        return "role-super-admin";

      case 2:
        return "role-admin";

      case 3:
        return "role-cashier";

      default:
        return "";
    }
  };

  const getRoleIcon = (roleId) => {
    switch (roleId) {
      case 1:
        return <SafetyCertificateOutlined />;

      case 2:
        return <SettingOutlined />;

      case 3:
        return <ShoppingCartOutlined />;
    }
  };

  const userColumns = [
    {
      title: "Nama",
      render: (_, record) => (
        <div className="user-cell">
          <div className="user-mini-avatar">{getInitials(record.name)}</div>

          <div>
            <div className="user-name">{record.name}</div>

            <div className="user-id">#{record.id}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "Role",
      render: (_, record) => (
        <Tag className={getRoleClass(record.role)}>
          {getRoleLabel(record.role)}
        </Tag>
      ),
    },
    {
      title: "Status",
      render: (_, record) => (
        <Tag className={record.is_active ? "status-paid" : "status-pending"}>
          {record.is_active ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
    },
    {
      title: "Action",
      align: "center",
      render: () => (
        <div className="table-action">
          <Button icon={<EditOutlined />} />
          <Button danger icon={<DeleteOutlined />} />
        </div>
      ),
    },
  ];

  const permissionColumns = [
    {
      title: "Permission",
      render: (_, record) => (
        <div>
          <div className="permission-title">{record.label}</div>

          <div className="permission-description">{record.description}</div>
        </div>
      ),
    },

    ...roles.map((role) => ({
      title: role.label,
      align: "center",
      className: selectedRole === role.id ? "selected-role-column" : "",

      onCell: () => ({
        className: selectedRole === role.id ? "selected-role-column" : "",
      }),

      render: (_, record) =>
        record.roles[role.id] ? (
          <CheckOutlined className="permission-allowed" />
        ) : (
          <CloseOutlined className="permission-denied" />
        ),
    })),
  ];

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <div className="profile-banner" />

        <div className="profile-content">
          <div className="profile-avatar">{getInitials(user.name)}</div>

          <div className="profile-info">
            <div className="profile-name-wrapper">
              <h2>{user.name}</h2>

              <Tag className={getRoleClass(user.role)}>
                {getRoleLabel(user.role)}
              </Tag>
            </div>

            {/* <p>{user.username}</p> */}
          </div>

          <div className="profile-actions">
            <Button>Edit Profile</Button>

            <Button type="primary">Ubah Password</Button>
          </div>
        </div>
      </Card>

      <div className="roles-grid">
        {roles.map((role) => {
          const permissionCount = permissions.filter(
            (permission) => permission.roles?.[role.id],
          ).length;

          return (
            <Card
              key={role.id}
              className={
                selectedRole === role.id ? "role-card active" : "role-card"
              }
              onClick={() => setSelectedRole(role.id)}
            >
              <div className={`role-icon role-icon-${role.id}`}>
                {getRoleIcon(role.id)}
              </div>

              <div>
                <h3>{role.label}</h3>
                <span className="role-user-count">
                  {users.filter((user) => user.role === role.id).length} User
                </span>
              </div>

              <p>{role.description}</p>

              <div className="permission-count">
                <strong>{permissionCount}</strong>
                <span> / {permissions.length} permissions</span>
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <div className="permission-header">
          <div>
            <h2 className="section-title">Matriks Hak Akses</h2>

            <p className="permission-subtitle">
              Akses tiap tier user. Tier terpilih:
              <Tag className={getRoleClass(selectedRole)}>
                {getRoleLabel(selectedRole)}
              </Tag>
            </p>
          </div>
        </div>

        <Table
          rowKey="key"
          pagination={false}
          columns={permissionColumns}
          dataSource={permissions}
        />
      </Card>

      <Card>
        <div className="card-header">
          <div>
            <h2>Daftar User</h2>
            <p>Semua akun yang terdaftar</p>
          </div>

          <Button type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpenUserModal(true)}
          >
            Tambah User
          </Button>
        </div>

        <Table
          rowKey="id"
          columns={userColumns}
          dataSource={users}
          pagination={false}
        />
      </Card>

      <Modal
        title="Tambah User Baru"
        open={openUserModal}
        onCancel={() => {
          setOpenUserModal(false)
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Simpan"
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            console.log("Form Values:", values);
            // bisa di masukin API

            setOpenUserModal(false);
            form.resetFields();
          }}>
          <Form.Item
            label="Nama"
            name="name"
            rules={[{ required: true, message: "Nama wajib diisi" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Username wajib diisi" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password wajib diisi" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Konfirmasi Password"
            name="confirm_password"
            rules={[
              { required: true, message: "Konfirmasi Password wajib diisi" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Konfirmasi Password tidak cocok"));
                }
              })
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[
              {
                required: true,
                message: "Role wajib dipilih",
              },
            ]}
          >
            <Select
              options={roles.map((role) => ({
                value: role.id,
                label: role.label,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Status Aktif"
            name="is_active"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
