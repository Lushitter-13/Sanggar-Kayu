import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Input,
  Tag,
  Table,
  Modal,
  Form,
  InputNumber,
  Select,
  Tooltip,
} from "antd";

import {
  PlusOutlined,
  EditOutlined,
  InboxOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import "../Styles/Products.css";

const API_URL = import.meta.env.VITE_API_URL;

// Dummy Data
// const initialProducts = [
//   {
//     id: 1,
//     code: "PRD001",
//     name: "Kayu Jati Premium",
//     category: "Meja",
//     price_sell: 2500000,
//     price_promo: 2200000,
//     qty: 120,
//     unit: "pcs",
//     status: 1,
//   },
//   {
//     id: 2,
//     code: "PRD002",
//     name: "Pintu Minimalis",
//     category: "Kursi",
//     price_sell: 1800000,
//     price_promo: 1500000,
//     qty: 15,
//     unit: "pcs",
//     status: 1,
//   },
//   {
//     id: 3,
//     code: "PRD003",
//     name: "Kusen Jendela",
//     category: "Lemari",
//     price_sell: 850000,
//     price_promo: 0,
//     qty: 0,
//     unit: "pcs",
//     status: 0,
//   },
//   {
//     id: 4,
//     code: "PRD004",
//     name: "Handle Pintu",
//     category: "Rak",
//     price_sell: 75000,
//     price_promo: 65000,
//     qty: 8,
//     unit: "pcs",
//     status: 1,
//   },
//   {
//     id: 5,
//     code: "PRD005",
//     name: "Meja Kayu Jati",
//     category: "Custom",
//     price_sell: 1250000,
//     price_promo: 1100000,
//     qty: 25,
//     unit: "pcs",
//     status: 1,
//   },
//   {
//     id: 6,
//     code: "PRD006",
//     name: "Kursi Kayu Jati",
//     category: "Custom",
//     price_sell: 800000,
//     price_promo: 700000,
//     qty: 7,
//     unit: "pcs",
//     status: 0,
//   },
// ]

const categories = [
  "All",
  "Meja",
  "Kursi",
  "Lemari",
  "Rak",
  "Custom",
];

// Format Rupiah
const formatIDR = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
};

// Stock Status
const getStockStatus = (product) => {
  if (product.status === 0) {
    return {
      text: "Nonaktif",
      color: "gray"
    }
  }

  if (product.status === 1 && product.qty === 0) {
    return {
      text: "Out of Stock",
      color: "red"
    }
  }

  if (product.status === 1 && product.qty > 0 && product.qty <= 20) {
    return {
      text: "Low Stock",
      color: "orange"
    }
  }

  return {
    text: "Active",
    color: "green"
  }
}

const Products = () => {
    // const [products] = useState(initialProducts);
    const [products, setProducts] = useState([]);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    const [openModal, setOpenModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingProduct(null);

        form.resetFields();

        form.setFieldsValue({
            status: 1,
        });

        setOpenModal(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);

        setOpenModal(true);

        form.setFieldsValue(product);

    };

    // Filter
    const filteredProducts = products.filter((product) => {

        const matchCategory = category === "All" || product.category === category;

        const matchSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.code.toLowerCase().includes(search.toLowerCase());

        return matchCategory && matchSearch;
    });

    // Edit Stock
    const [stockModalOpen, setStockModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [reload, setReload] = useState(false);
    const [stockQty, setStockQty] = useState(0);
    const handleStock = (product) => {
        setSelectedProduct(product);

        setStockQty(product.qty);

        setStockModalOpen(true);
    };
    const handleSaveStock = () => {
        console.log({
            product: selectedProduct,
            qty: stockQty,
        });
        // Input ke API untuk update stock

        setStockModalOpen(false);
        setReload(prev => !prev)
    };

    const handleAddProduct = async (values) => {
        try {
            console.log("Form Values:", values);
            if (editingProduct) {
                console.log("EDIT PRODUCT");
            } else {
                console.log("ADD PRODUCT");
            }

            Modal.success({
                title: "Berhasil",
                content: editingProduct
                    ? "Produk berhasil diubah"
                    : "Produk berhasil ditambahkan",
            });

            setOpenModal(false);
            form.resetFields();
            setEditingProduct(null);
            setReload(prev => !prev);

        } catch (err) {
            Modal.error({
                title: "Gagal",
                content: editingProduct
                    ? "Produk gagal diubah, coba kembali"
                    : "Produk gagal ditambahkan, coba kembali",
            });
            console.log("Error adding/editing product:", err);
        }
    };

    const columns = [
        {
            title: "Kode",
            dataIndex: "code",
            key: "code",
            width: 120,
        },

        {
            title: "Nama Produk",
            dataIndex: "name",
            key: "name",
        },

        {
            title: "Kategori",
            dataIndex: "category",
            key: "category",

            render: (category) => (
                <Tag color="blue">
                {category}
                </Tag>
            ),
        },

        {
            title: "Harga",
            key: "price",
            align: "right",

            render: (_, record) => {

                const hasPromo =
                record.price_promo > 0 &&
                record.price_promo < record.price_sell;

                return (
                <div className="price-wrapper">

                    {/* Harga Normal */}
                    <span
                    className={
                        hasPromo
                        ? "normal-price promo-active"
                        : "normal-price"
                    }
                    >
                    {formatIDR(record.price_sell)}
                    </span>

                    {/* Harga Promo */}
                    {hasPromo && (
                    <span className="promo-price">
                        {formatIDR(record.price_promo)}
                    </span>
                    )}

                </div>
                );
            },
        },

        {
            title: "Stok",
            key: "qty",
            align: "right",

            render: (_, record) => (
                <>
                {record.qty} {record.unit}
                </>
            ),
        },

        {
            title: "Status",
            key: "status",

            render: (_, record) => {

                const stock = getStockStatus(record);

                return (
                <Tag color={stock.color}>
                    {stock.text}
                </Tag>
                );
            },
        },

        {
            title: "Aksi",
            key: "action",
            align: "center",

            render: (_, record) => (
                <div className="table-action">

                <Tooltip title="Edit Produk">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                </Tooltip>

                <Tooltip title="Edit Stok">
                    <Button
                        icon={<InboxOutlined />}
                        onClick={() => handleStock(record)}
                    />
                </Tooltip>

                </div>
            ),
        },
    ];

    useEffect(() => {
        // To fetch product's data from API
        (async () => {
            const response = await fetch(`${API_URL}/get_products`);
            const data = await response.json();

            setProducts(data);
            console.log("Fetched products:", data);
        })();
    }, [reload]);

    return (
        <div className="products-container">

            {/* Header */}
            <div className="products-header">
                <div>

                    <h1 className="products-title">
                        Products
                    </h1>

                    <p className="products-subtitle">
                        Kelola katalog kayu, custom order & perintilan.
                    </p>

                </div>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    className="add-product-button"
                    onClick={handleAdd}
                >
                    Add Product
                </Button>

            </div>

            {/* Filter */}
            <Card className="filter-card">
                <div className="filter-wrapper">

                    {/* Input */}
                    <Input
                        placeholder="Cari kode atau nama..."
                        prefix={<SearchOutlined />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="product-search"
                    />

                    {/* Category */}
                    <div className="category-wrapper">
                        {categories.map((cat) => (

                            <Button
                                key={cat}
                                type= {
                                    category === cat
                                    ? "primary"
                                    : "default"
                                }
                                onClick={() => setCategory(cat)}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Table */}
            <Card className="table-card">

                <Table
                    columns={columns}
                    dataSource={filteredProducts}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                />

            </Card>

            {/* Modal */}
            <Modal
                open={openModal}
                forceRender
                title= {
                    editingProduct ? "Edit Product" : "Add Product"
                }
                footer={null}
                onCancel={() =>
                    {
                        setOpenModal(false);
                        form.resetFields();
                        setEditingProduct(null);
                    }
                }
            >

                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        code: editingProduct?.code || "",
                        category: editingProduct?.category || undefined,
                        name: editingProduct?.name || "",
                        price_sell: editingProduct?.price_sell || 0,
                        price_promo: editingProduct?.price_promo || 0,
                        qty: editingProduct?.qty || 0,
                        status: editingProduct?.status ?? 1,
                        description: editingProduct?.description || "",
                    }}
                    onFinish={(values) => {
                        // console.log(values);

                        // if (editingProduct) {
                        //     console.log("EDIT PRODUCT");
                        // } else {
                        //     console.log("ADD PRODUCT");
                        // }

                        // // klo berhasil
                        // Modal.success({
                        //     title: "Berhasil",
                        //     content: editingProduct != null
                        //     ? "Produk berhasil diubah"
                        //     : "Produk berhasil ditambahkan",
                        // });

                        
                        // // klo gagal
                        // // Modal.error({
                        // //       title: "Gagal",
                        // //       content: editingProduct != null
                        // //       ? "Produk gagal diubah, coba kembali"
                        // //       : "Produk gagal ditambahkan, coba kembali",
                        // // })

                        // setOpenModal(false);
                        // form.resetFields();
                        // setEditingProduct(null);
                        // setReload(prev => !prev)
                        handleAddProduct(values);
                    }}
                >
                        <div className="form-grid">
                            <Form.Item
                                label="Kode"
                                name="code"
                                rules={[
                                    {
                                        required: true,
                                        message: "Kode wajib diisi",
                                    },
                                ]}
                            >
                                <Input placeholder="PRD005" />
                            </Form.Item>

                            <Form.Item
                                label="Kategori"
                                name="category"
                                rules={[
                                    {
                                        required: true,
                                        message: "Kategori wajib diisi",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Pilih kategori"
                                    options={categories
                                        .filter((cat) => cat !== "All")
                                        .map((cat) => ({
                                            label: cat,
                                            value: cat,
                                        }))}
                                />
                            </Form.Item>
                        </div>

                        <Form.Item
                            label="Nama Produk"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Nama produk wajib diisi",
                                },
                            ]}
                        >
                            <Input placeholder="Nama produk..." />
                        </Form.Item>

                        <div className="form-grid">
                            <Form.Item
                                label="Harga Normal"
                                name="price_sell"
                                rules={[
                                    {
                                        required: true,
                                        message: "Harga normal wajib diisi",
                                    }
                                ]}
                            >

                                <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder="0"
                                />

                            </Form.Item>

                            <Form.Item
                                label="Harga Promo"
                                name="price_promo"
                            >

                                <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder="0"
                                />

                            </Form.Item>
                        </div>

                        <div className="form-grid">
                            <Form.Item
                                label="Qty"
                                name="qty"
                                rules={[
                                    {
                                        required: true,
                                        message: "Qty wajib diisi",
                                    }
                                ]}
                            >

                                <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder="0"
                                />
                                
                            </Form.Item>

                            <Form.Item
                                label="Status"
                                name="status"
                            >

                                <Select
                                    options={[
                                    {
                                        label: "Active",
                                        value: 1,
                                    },
                                    {
                                        label: "Nonactive",
                                        value: 0,
                                    },
                                    ]}
                                />

                            </Form.Item>
                        </div>

                        <Form.Item
                            label="Description"
                            name="description"
                        >

                            <Input.TextArea
                                rows={4}
                                placeholder="Masukkan deskripsi produk..."
                            />

                        </Form.Item>

                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                        >
                            {
                                editingProduct
                                ? "Update Product"
                                : "Add Product"
                            }

                        </Button>
                </Form>

            </Modal>

            <Modal
                title={`Adjust Stock - ${selectedProduct?.name}`}
                open={stockModalOpen}
                onCancel={() => setStockModalOpen(false)}
                footer={null}
                centered
            >
                <Form
                    layout="vertical"
                    onFinish={handleSaveStock}
                >
                    <Form.Item label="Jumlah Stok">

                        <div className="stock-adjust-control">

                            <Button
                                onClick={() =>
                                    setStockQty((prev) =>
                                        prev > 0 ? prev - 1 : 0
                                    )
                                }
                            >
                                -
                            </Button>

                            <span className="stock-value">
                                {stockQty}
                            </span>

                            <Button
                                onClick={() =>
                                    setStockQty((prev) => prev + 1)
                                }
                            >
                                +
                            </Button>

                        </div>

                    </Form.Item>

                    <div className="modal-footer">
                        <Button
                            onClick={() => setStockModalOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="primary"
                            htmlType="submit"
                        >
                            Save Changes
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}

export default Products;