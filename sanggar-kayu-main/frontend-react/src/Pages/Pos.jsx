import {
  Card,
  Input,
  Button,
  Tag,
  Modal,
  Form,
  Select,
  DatePicker,
  InputNumber,
} from "antd";

import {
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import { useMemo, useState } from "react";
// import Item from "antd/es/list/Item";
import "../Styles/Pos.css";
// import { useForm } from "antd/es/form/Form";

// Dummy Data
const productsData = [
    {
      id: 1,
      code: "PRD001",
      name: "Kayu Jati Premium",
      category: "Kayu",
      price_sell: 2500000,
      price_promo: 2200000,
      qty: 120,
      status: 1,
  },
  {
    id: 2,
    code: "PRD002",
    name: "Pintu Minimalis",
    category: "Pintu",
    price_sell: 1800000,
    price_promo: 1500000,
    qty: 15,
    status: 1,
  },
  {
    id: 3,
    code: "PRD003",
    name: "Kusen Jendela",
    category: "Kusen",
    price_sell: 850000,
    price_promo: 0,
    qty: 0,
    status: 0,
  },
];

// Format Rupiah
const formatIDR = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
}

const Transactions = () => {
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openCustomModal, setOpenCustomModal] = useState(false);
    const [detailTransactionForm] = Form.useForm();

    const [customForm, setCustomForm] = useState({
      name: "",
      price_sell: "",
      description: "",
    });

    const filteredProducts = useMemo(() => {
        return productsData.filter((product) => {

            const matchSearch = 
            search === "" || product.name.toLowerCase().includes(search.toLowerCase());
            return matchSearch && product.status === 1;

        });
    }, [search]);

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.code === product.code);

            if (existing) {
                return prev.map((item) =>
                    item.code === product.code ? { ...item, qty: item.qty + 1 } : item
                );
            }

            return [...prev, { ...product, qty: 1 }];
        });
        
    }

    const updateQty = (code, change) => {
      setCart((prev) =>
        prev.map((item) => {

            if (item.code !== code) {
              return item;
            }

            return {
              ...item,
              qty: item.qty + change,
            };
          })
          .filter((item) => item.qty > 0)
      );
    }

    const removeItem = (code) => {
      setCart((prev) => prev.filter((item) => item.code !== code));
    }

    const subtotal = cart.reduce((acc, item) => {
      const price = item.price_promo > 0 ? item.price_promo : item.price_sell;

      return acc + price * item.qty;
    }, 0)

    const tax = subtotal * 0.1;
    
    const total = subtotal + tax;

    const addCustomItem = () => {

      const customItem = {
        code: `CUST-${Date.now()}`,
        name: customForm.name,
        price_sell: parseFloat(customForm.price_sell),
        price_promo: 0,
        description: customForm.description.length > 0 ? customForm.description : null,
        qty: 999,
        status: 1,
      }

      addToCart(customItem);

      setCustomForm({
        name: "",
        price_sell: "",
        description: "",
      });

      setOpenCustomModal(false);
    }

    return (
      <div className="pos-layout">

        {/* Left */}
        <div className="pos-products">
          <div className="page-header">
            <div>
              <h2>Cashier</h2>
              <p>Pilih produk </p>
            </div>
          </div>

          {/* Search Bar */}
          <Input
            placeholder="Cari produk..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="product-grid">
            <Card
              className="custom-product-card"
              onClick={() => setOpenCustomModal(true)}
            >
              <div className="custom-product-content">
                <div className="custom-product-icon">
                  📦<PlusOutlined />
                </div>

                <div className="custom-product-title">
                  Other Item
                </div>

                <div className="custom-product-subtitle">
                  Add custom product manually
                </div>
              </div>
            </Card>
            {filteredProducts.map((product) => {
              const price = product.price_promo > 0 ? product.price_promo : product.price_sell;

              return (
                <Card key={product.code}>
                  <div className="product-card" onClick={() => addToCart(product)}>

                    <div className="product-top">
                      <Tag>
                        {product.category}
                      </Tag>
                      <span>{product.code}</span>
                    </div>

                    <p className="product-name">{product.name}</p>

                    <div className="product-bottom">

                      <div>
                        {
                          product.price_promo > 0 && (
                            <span className="price-normal">{formatIDR(product.price_sell)}</span>
                          )
                        }
                        <p className="price-promo">{formatIDR(price)}</p>
                      </div>

                      <span className="product-stock">{product.qty} pcs</span>

                    </div>

                  </div>
                </Card>
              )
            })}
          </div>

        </div>

        {/* Right */}
        <Card className="cart-card">
          <div className="cart-header">
            <div className="cart-title-wrapper">
              <ShoppingCartOutlined />
              <h2>Keranjang</h2>
            </div>
            
            {
              cart.length === 0 ? (
                <p className="empty-cart">Belum ada item dipilih</p>
              ) : (
                cart.map((item) => {
                  const price = item.price_promo > 0 ? item.price_promo : item.price_sell

                  return (
                    <div
                      className="cart-item"
                      key={item.code}
                    >

                      <div className="cart-item-info">

                        <p className="cart-item-name">{item.name} {item.is_custom && (<Tag color="gold">Custom</Tag>)}</p>
                        <p className="cart-item-price">{formatIDR(price)}</p>

                      </div>

                      <div className="cart-actions">

                        <Button
                          icon={<MinusOutlined />}
                          onClick={() => updateQty(item.code, -1)}
                        />

                        <span className="cart-qty">{item.qty}</span>

                        <Button
                          icon={<PlusOutlined />}
                          onClick={() => updateQty(item.code, 1)}
                        />

                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeItem(item.code)}
                        />
                      </div>

                    </div>
                  )
                })
              )
            }
          </div>

          <div className="cart-summary">

            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatIDR(subtotal)}</span>
            </div>

            <div className="summary-row">
              <span>Pajak 10%</span>
              <span>{formatIDR(tax)}</span>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>{formatIDR(total)}</span>
            </div>

          </div>

          <Button
            type="primary"
            block
            disabled={cart.length === 0}
            onClick={() => setOpenModal(true)}
          >
            Add Transaction
          </Button>

        </Card>

        {/* Modal */}
        <Modal
          open={openModal}
          title="Detail Transaksi"
          footer={null}
          onCancel={() => {
            setOpenModal(false);
            detailTransactionForm.resetFields();
          }}
          centered
        >

          <Form
            form={detailTransactionForm}
            layout="vertical"
            onFinish={(values) => {
              console.log(values)
              const payload = {
                ...values,
                tax,
                total,
                items: cart.map((item) => ({
                  product_id: item.id,
                  qty: item.qty,
                  price:
                    item.price_promo > 0
                      ? item.price_promo
                      : item.price_sell,
                }))
              }
              console.log("payload: ", payload)
              // Bisa masukin API di sini

              detailTransactionForm.resetFields()
              setCart([])
              setOpenModal(false)
              
              // klo berhasil
              Modal.success({
                title: "Berhasil",
                content: "Transaksi berhasil dibuat",
              });

              // klo gagal
              // Modal.error({
              //   title: "Gagal",
              //   content: "Transaksi gagal ditambahkan, coba ulang kembali",
              // })
            }}
          >
              <Form.Item
                label="Nama Customer"
                name="customer_name"
                rules={[
                  {
                    required: true,
                    message: "Nama customer wajib diisi",
                  }
                ]}
              >
                <Input placeholder="Masukkan nama customer" />
              </Form.Item>

              <Form.Item
                label="Metode Pembayaran"
                name="payment_method"
                rules={[
                  {
                    required: true,
                    message: "Metode pembayaran wajib diisi",
                  }
                ]}
              >
                <Select placeholder="Pilih metode"
                  options={[
                    { label: "Cash", value: "cash" },
                    {label: "QRIS", value: "qris" },
                    {label: "Debit", value: "debit" },
                    {label: "Check Giro", value: "giro"}
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="Tanggal"
                name="transaction_date"
                rules={[
                  {
                    required: true,
                    message: "Tanggal wajib diisi",
                  }
                ]}
              >
                <DatePicker
                  format="DD/MM/YY"
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                label="Catatan"
                name="notes"
              >
                <Input.TextArea placeholder="Masukkan catatan (opsional)" />
              </Form.Item>

              <div className="modal-footer">
                <Button
                  onClick={() => {
                    detailTransactionForm.resetFields();
                    setOpenModal(false);
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="primary"
                  htmlType="submit"
                >
                  Add Now · {formatIDR(total)}
                </Button>
              </div>
          </Form>

        </Modal>

        <Modal
          open={openCustomModal}
          title="Add Custom Item"
          footer={null}
          onCancel={() => setOpenCustomModal(false)}
        >
          <Form layout="vertical">
            <Form.Item label="Nama Produk" required>
              <Input
                value={customForm.name}
                onChange={(e) =>
                  setCustomForm({
                    ...customForm,
                    name: e.target.value,
                  })
                }
              />
            </Form.Item>

            <Form.Item label="Harga" required>
              <InputNumber
                style={{ width: "100%" }}
                value={customForm.price_sell}
                onChange={(value) =>
                  setCustomForm({
                    ...customForm,
                    price_sell: value,
                  })
                }
              />
            </Form.Item>

            <Form.Item label="Description">
              <Input.TextArea
                rows={3}
                value={customForm.description}
                onChange={(e) =>
                  setCustomForm({
                    ...customForm,
                    description: e.target.value,
                  })
                }
              />
            </Form.Item>

            <Button
              type="primary"
              block
              onClick={addCustomItem}
              disabled={
                !customForm.name ||
                !customForm.price_sell
              }
            >
              Add Item
            </Button>

          </Form>
        </Modal>

      </div>
    )
}

export default Transactions;