import {
  Card,
  Input,
  Button,
  Tag,
  Modal,
  Form,
  Select,
  InputNumber,
} from "antd";

import {
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import { useMemo, useState, useEffect } from "react";
import "../Styles/Pos.css";
import "../Styles/Page.css";

const API_URL = import.meta.env.VITE_API_URL;


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
    const [products, setProducts] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [reload, setReload] = useState(false);

    const [customForm, setCustomForm] = useState({
      name: "",
      price_sell: "",
      description: "",
    });

    const filteredProducts = useMemo(() => {
        // return productsData.filter((product) => {
        return products.filter((product) => {

            const matchSearch = 
            search === "" || product.name.toLowerCase().includes(search.toLowerCase());
            return matchSearch && product.status === "Active" && product.category_id != 5;

        });
    }, [search, products]);

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find(item => !item.is_custom && item.code === product.code);

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

    const addCustomItem = async () => {

      const customItem = {
        code: `CUST-${Date.now()}`,
        name: customForm.name,
        category_id: 5,
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

    const checkOut = async (values) => {
      console.log("VALUES: ", values)
      if (cart.length === 0) {
        Modal.warning ({
          title: "Cart kosong",
          content: "Tambahkan produk terlebih dahulu.",
        })
        return
      }

      try {
        const user_id = JSON.parse(localStorage.getItem("user"))?.id;
        console.log("Status:", values.payment_status)
        const response = await fetch(`${API_URL}/checkout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_name: values.customer_name,
            user_id: user_id,
            payment_method: values.payment_method,
            status: values.payment_status,
            notes: values.notes,

            subtotal,
            tax,
            total_price: total,

            details: cart.map((item) => {
              const price =
                item.price_promo > 0
                  ? item.price_promo
                  : item.price_sell;
                  
              return{
              product_id: item.id,
              qty: item.qty,
              price:
                item.price_promo > 0
                  ? item.price_promo
                  : item.price_sell,
              total: price * item.qty
            }}),
          }),
        });

        const data = await response.json();

        if (!data.success) {
          Modal.error({
            title: "Checkout gagal",
            content: data.message,
          });
          return;
        }

        Modal.success({
          title: "Berhasil",
          content: `Transaksi ${data.transaction_number} berhasil dibuat`,
        });

        setCart([]);
        detailTransactionForm.resetFields();
        setOpenModal(false);

        setReload(prev => !prev); // reload stock
      } catch (err) {
        console.error(err);

        Modal.error({
          title: "Error",
          content: "Terjadi kesalahan.",
        });
      }
    }

    useEffect(() => {
        // To fetch user's data from API
            (async () => {
              const response = await fetch(`${API_URL}/get_products`);
              const data = await response.json();
              const responsePaymentMethod = await fetch(`${API_URL}/get_payment_methods`);
              const dataPaymentMethods = await responsePaymentMethod.json();
      
              setProducts(data);
              setPaymentMethods(dataPaymentMethods)
              console.log("Fetched products:", data);
              console.log("Fetched Payment Methods:", dataPaymentMethods);
            })();
        }, [reload]);

    return (
      <div className="pos-layout">

        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Cashier</h1>
            <p>Pilih produk </p>
          </div>
        </div>
        

        {/* Left */}
        <div className="pos-workspace">
          <div className="pos-products">
            {/* <div className="page-header">
              <div>
                <h2>Cashier</h2>
                <p>Pilih produk </p>
              </div>
            </div> */}

            {/* Search Bar */}
            <Input
              placeholder="Cari produk..."
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="product-grid">
              {/* UNCOMMAND IT IF YOU NEED CUSTOM ITEM */}
              {/* <Card
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
              </Card> */}
              {filteredProducts.map((product) => {
                console.log("Filtered Products", filteredProducts)
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
            </div>
            
            <div className="cart-items">
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
        </div>

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
            onFinish={checkOut}
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
                  // options={[
                  //   { label: "Cash", value: "cash" },
                  //   {label: "QRIS", value: "qris" },
                  //   {label: "Debit", value: "debit" },
                  //   {label: "Check Giro", value: "giro"}
                  // ]}
                  options={paymentMethods.map((item) => ({
                    label: item.payment_method_name,
                    value: item.id,
                }))}
                />
              </Form.Item>

              {/* <Form.Item
                label="Tanggal"
                name="transaction_date"
                initialValue={dayjs()}
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
              </Form.Item> */}
              
              <Form.Item
                label="Status Pembayaran"
                name="payment_status"
                rules={[
                  {
                    required: true,
                    message: "Status pembayaran wajib diisi",
                  }
                ]}
              >
                <Select placeholder="Pilih metode"
                  options={[
                    {label: "Paid", value: "paid" },
                    {label: "Pending", value: "pending" },
                  ]}
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