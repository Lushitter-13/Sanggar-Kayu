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
import "../Styles/Page.css";

const API_URL = import.meta.env.VITE_API_URL;

// const categories = [
//   "All",
//   "Meja",
//   "Kursi",
//   "Lemari",
//   "Rak",
//   "Custom",
// ];

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
    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState("All"); // Filter Category

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
        // console.log({
        //     product: selectedProduct,
        //     qty: stockQty,
        // });
        // Input ke API untuk update stock

        setStockModalOpen(false);
        setReload(prev => !prev)
    };

    const handleAddProduct = async (values) => {
        try {
            console.log("Values:", values);
            if (editingProduct) {
                console.log("EDIT PRODUCT");
                const responseEditProduct = await fetch(`${API_URL}/update_product`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: editingProduct.id,
                        code: values.code,
                        name: values.name,
                        category_id: editingProduct.category_id,
                        qty: values.qty,
                        price_sell: values.price_sell,
                        price_promo: values.price_promo || 0,
                        description: values.description || null,
                    }),
                });

                const editProductData = await responseEditProduct.json();
                
                if (!editProductData.success) {
                    Modal.error({
                        title: "Gagal",
                        content: editProductData.message || "Produk gagal diubah",
                    });
                    return;
                }

            } else {
                console.log("ADD PRODUCT: ", values);
                const responseAddProduct = await fetch(`${API_URL}/add_product`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        code: values.code,
                        name: values.name,
                        category_id: values.category_id,
                        qty: values.qty,
                        price_sell: values.price_sell,
                        price_promo: values.price_promo || 0,
                        description: values.description || null,
                        status: values.status,
                    }),
                });

                const addProductData = await responseAddProduct.json();

                if (!addProductData.success) {
                    Modal.error({
                        title: "Gagal",
                        content: addProductData.message || "Produk gagal dibuat",
                    });
                    return;
                }
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
            const responseProducts = await fetch(`${API_URL}/get_products`);
            const dataProducts = await responseProducts.json();

            setProducts(dataProducts);

            const responseCategories = await fetch(`${API_URL}/get_categories`);
            const dataCategories = await responseCategories.json();

            setCategories(dataCategories);
            console.log("Fetched Categories: ", dataProducts, "\n Fetched Categories: ", dataCategories);
        })();
    }, [reload]);

    return (
        <div className="products-container">

            {/* Header */}
            <div className="page-header">
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
                        <Button
                            type={category === "All"
                                ?"primary"
                                :"default"}
                            onClick={() => setCategory("All")}
                        >
                            All
                        </Button>
                        {categories.map((cat) => (

                            <Button
                                key={cat.name}
                                type= {
                                    category === cat.name
                                    ? "primary"
                                    : "default"
                                }
                                onClick={() => setCategory(cat.name)}
                            >
                                {cat.name}
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
                                name="category_id"
                                rules={[
                                    {
                                        required: true,
                                        message: "Kategori wajib diisi",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Pilih kategori"
                                    options={categories.map((cat) => ({
                                        label: cat.name,
                                        value: cat.id
                                    }))
                                    }
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