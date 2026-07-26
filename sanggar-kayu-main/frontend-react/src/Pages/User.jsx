import { useState, useEffect } from "react";
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

const API_URL = import.meta.env.VITE_API_URL;

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
  const [usersData, setUsersData] = useState([]);
  const [selectedRole, setSelectedRole] = useState(1);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openEditProfileModal, setOpenEditProfileModal] = useState(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [form] = Form.useForm();
  const [editProfileForm] = Form.useForm();
  const [changePasswordForm] = Form.useForm();
  const [reload, setReload] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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
      render: (_, record) => (
        <div className="table-action">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedUser(record);
              setOpenEditProfileModal(true);
              form.setFieldsValue(record);
            }}
          />
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

  useEffect(() => {
    // To fetch user's data from API
        (async () => {
          const response = await fetch(`${API_URL}/get_users`);
          const data = await response.json();
  
          setUsersData(data);
          console.log("Fetched users:", data);
        })();
    }, [reload]);

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
            <Button
              className="edit-profile-btn"
              onClick={() => {
                  const formData = {
                    name: user.name,
                    username: user.username,
                    role: user.role,
                    is_active: user.is_active === 1,
                  }

                  editProfileForm.setFieldsValue(formData);

                  setOpenEditProfileModal(true)
                }
              }
            >
              Edit Profile
            </Button>

            <Button
              type="primary"
              onClick={() => setOpenChangePasswordModal(true)
              }
            >
              Ubah Password
            </Button>
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
            onClick={() => {
              form.resetFields();
              setOpenUserModal(true)
            }}
          >
            Tambah User
          </Button>
        </div>

        <Table
          rowKey="id"
          columns={userColumns}
          dataSource={usersData}
          pagination={false}
        />
      </Card>

      {/* Add User Modal */}
      <Modal
        title="Tambah User Baru"
        open={openUserModal}
        footer={null}
        onCancel={() => {
          setOpenUserModal(false)
          form.resetFields();
        }}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            console.log("Form Values:", values);

            try {
              const response = await fetch(`${API_URL}/add_user`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: values.name,
                    username: values.username,
                    role: values.role,
                    is_active: values.is_active ? 1 : 0,
                    password: values.password,
                  }),
                }
              );

              const data = await response.json();

              if (data.success) {
                Modal.success({
                  title: "Berhasil",
                  content: "User berhasil dibuat",
                })
              } else {
                Modal.error({
                  title: "Gagal",
                  content: "User gagal dibuat, coba ulang kembali",
                })
              }
            }

            catch (error) {
              console.error("Error adding user:", error);
              Modal.error({
                title: "Gagal",
                content: "Terjadi kesalahan, coba ulang kembali",
              })
            }

            // klo berhasil
            // Modal.success({
            //   title: "Berhasil",
            //   content: "User berhasil dibuat",
            // });

            // klo gagal
            // Modal.error({
            //   title: "Gagal",
            //   content: "User gagal dibuat, coba ulang kembali",
            // })

            form.resetFields();
            setOpenUserModal(false);
            setReload(prev => !prev);
          }}>
          <Form.Item
            label="Nama"
            name="name"
            rules={[{ required: true, message: "Nama wajib diisi" }]}
          >
            <Input placeholder="Masukkan nama" />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Username wajib diisi" }]}
          >
            <Input placeholder="Masukkan username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password wajib diisi" }]}
          >
            <Input.Password placeholder="Masukkan password" />
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
            <Input.Password placeholder="Konfirmasi password" />
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
              placeholder="Pilih role"
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

          <div className="modal-footer">
            <Button
                onClick={() => {
                    form.resetFields();
                    setOpenUserModal(false);
                }}
            >
                Cancel
            </Button>

            <Button
                type="primary"
                htmlType="submit"
            >
                Add User
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        title= "Edit Profile"
        open={openEditProfileModal}
        onCancel={() => {
          editProfileForm.resetFields();
          setSelectedUser(null);
          setOpenEditProfileModal(false);
        }}
        footer= {null}
        centered
      >

        <Form
          form={editProfileForm}
          layout="vertical"
          initialValues={{
            name: selectedUser?.name || "",
            username: selectedUser?.username || "",
            role: selectedUser?.role || 1,
            is_active: selectedUser?.is_active === 1,
          }}
          onFinish={async (values) => {
            console.log("Editing user:", selectedUser.id, "with values:", values);
            try {
              const response = await fetch(`${API_URL}/update_user/${selectedUser.id}`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: values.name,
                    username: values.username,
                    role: values.role,
                    is_active: values.is_active ? 1 : 0,
                    password: values.password,
                  }),
                }
              );

              const data = await response.json();

              if (data.success) {
                Modal.success({
                  title: "Berhasil",
                  content: "Profile berhasil diubah",
                })
              } else {
                Modal.error({
                  title: "Gagal",
                  content: "Profile gagal diubah, coba ulang kembali",
                })
              }
            }

            catch (error) {
              console.error("Error updating profile:", error);
              Modal.error({
                title: "Gagal",
                content: "Terjadi kesalahan, coba ulang kembali",
              })
            }

            editProfileForm.resetFields();
            setOpenEditProfileModal(false);
            setSelectedUser(null);
            setReload(prev => !prev);
          }}
        >

          <Form.Item
            label="Nama"
            name="name"
            rules={[{
              required: true,
              message: "Nama wajib diisi",
            }]}
            >
              <Input placeholder="Masukkan nama" />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Username wajib diisi",
              },
            ]}
          >
            <Input placeholder="Masukkan username" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
          >
            <Select
              placeholder="Pilih role"
              options={roles.map((role) => ({
                value: role.id,
                label: role.label,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Password Baru"
            name="password"
          >
            <Input.Password placeholder="Masukkan password baru" />
          </Form.Item>

          <Form.Item
            label="Status Aktif"
            name="is_active"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <div className="modal-footer">
              <Button onClick={() => {
                setOpenEditProfileModal(false);
                setSelectedUser(null);
                editProfileForm.resetFields();
                }}>
                Cancel
              </Button>

              <Button
                type="primary"
                htmlType="submit"
              >
                Simpan Perubahan
              </Button>
          </div>

        </Form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        title="Ubah Password"
        open={openChangePasswordModal}
        onCancel={() => setOpenChangePasswordModal(false)}
        footer={null}
        centered
      >
        <Form
          form={changePasswordForm}
          layout="vertical"
          onFinish={async (values) => {
            console.log(values);

            try {
              const response = await fetch(`${API_URL}/update_user/${localStorage.getItem("user_id")}`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    password: values.password,
                  }),
                }
              );

              const data = await response.json();

              if (data.success) {
                Modal.success({
                  title: "Berhasil",
                  content: "Password berhasil diubah",
                })
              } else {
                Modal.error({
                  title: "Gagal",
                  content: "Password gagal diubah, coba ulang kembali",
                })
              }
            }

            catch (error) {
              console.error("Error updating password:", error);
              Modal.error({
                title: "Gagal",
                content: "Terjadi kesalahan, coba ulang kembali",
              })
            }

            changePasswordForm.resetFields()
            setOpenChangePasswordModal(false);
            setReload(prev => !prev);
          }}
        >
          <Form.Item
            label="Password Baru"
            name="password"
            rules={[
              {
                required: true,
                message: "Password wajib diisi",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Konfirmasi Password"
            name="confirm_password"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Konfirmasi password wajib diisi",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    !value ||
                    getFieldValue("password") === value
                  ) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error(
                      "Konfirmasi password tidak sama"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <div className="modal-footer">
            <Button
              onClick={() => setOpenChangePasswordModal(false)}
            >
              Cancel
            </Button>

            <Button
              type="primary"
              htmlType="submit"
            >
              Simpan
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
