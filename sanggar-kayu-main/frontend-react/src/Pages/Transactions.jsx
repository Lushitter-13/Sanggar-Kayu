import {
  Card,
  Input,
  Button,
  Table,
  Tag,
  Select,
  DatePicker,
  Space,
  Modal,
  Divider,
} from "antd";

import {
  SearchOutlined,
  EyeOutlined,
  PrinterOutlined,
  DownloadOutlined,
  EditOutlined
} from "@ant-design/icons";

import { useMemo, useState, useEffect } from "react";
import dayjs from "dayjs";

import "../Styles/Transactions.css";
import "../Styles/Page.css";

const API_URL = import.meta.env.VITE_API_URL;
const { RangePicker } = DatePicker;

const formatIDR = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
}

const Transactions = () => {
    const [search, setSearch] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("all"); //For filter
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]); //For payment method's list
    const [transactions, setTransactions] = useState([]);
    const [modalMode, setModalMode] = useState("view");
    const [dateRange, setDateRange] = useState([]);

    const [reload, setReload] = useState(false);

    const filteredTransactions = useMemo(() => {
        // console.log("Payment Method Filter: ", paymentMethod)
        return transactions.filter((transaction) => {
            const matchPayment =
                paymentMethod === "all" ||
                transaction.payment_method_code === paymentMethod;
                
            const matchSearch =
                search ==="" ||
                transaction.transaction_number.toLowerCase().includes(search.toLowerCase()) ||
                transaction.customer_name.toLowerCase().includes(search.toLowerCase());

            const matchDate = 
                dateRange.length === 0 ||
                (
                    dayjs(transaction.transaction_date).isSame(dateRange[0], "day") ||
                    dayjs(transaction.transaction_date).isAfter(dateRange[0], "day")
                ) &&
                (
                    dayjs(transaction.transaction_date).isSame(dateRange[1], "day") ||
                    dayjs(transaction.transaction_date).isBefore(dateRange[1], "day")
                );

            return matchPayment && matchSearch && matchDate;            
        })
    }, [transactions, search, paymentMethod, dateRange]);

    const totalRevenue = filteredTransactions.reduce((acc, item) => acc + item.total_price, 0);
    const averageRevenue = filteredTransactions.length > 0 ? totalRevenue / filteredTransactions.length : 0;

    const handleSaveTransaction = async () => {
        try {
            const responseSave = await fetch(
                `${API_URL}/update_transaction`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: selectedTransaction.id,
                        status: selectedTransaction.status,
                    }),
                }
            )

            const data = await responseSave.json();

            if (!data.success) {
                Modal.error({
                    title: "Gagal",
                    content: data.message,
                });
                return;
            }

            Modal.success({
                title: "Berhasil",
                content: "Transaksi berhasil diubah",
            })

            setOpenDetailModal(false);
            setSelectedTransaction(null);
            setReload(prev => !prev);

        } catch (error) {
            console.error("Error updating transaction:", error);

            Modal.error({
                title: "Error",
                content: "Terjadi kesalahan saat mengubah transaksi",
            });
        }
    }

    const handleViewTransaction = (record) => {
        // console.log("View transaction:", record);
        setSelectedTransaction(record);
        setModalMode("view");
        setOpenDetailModal(true);
    }

    const handleEditTransaction = (record) => {
        console.log("Edit Transaction: ", record);
        setSelectedTransaction(record);
        setModalMode("edit");
        setOpenDetailModal(true);
    }

    const handlePrintTransaction = (record) => {
        console.log("Print transaction:", record);
    }

    const columns = [
        {
            title: "Invoice",
            dataIndex: "transaction_number",
            key: "transaction_number",
        },
        {
            title: "Customer",
            dataIndex: "customer_name",
            key: "customer_name",
            render: (customer) => (
                <strong>{customer}</strong>
            )
        },
        {
            title: "Tanggal",
            dataIndex: "transaction_date",
            key: "transaction_date",
            render: (date) => (
                <span>
                    {new Date(date).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                    })}
                </span>
            ),
        },
        {
            title: "Payment",
            dataIndex: "payment_method",
            key: "payment_method",
            render: (payment) => (
                <Tag className="payment-tag"><strong>{payment}</strong></Tag>
            ),
        },
        {
            title: "Total",
            dataIndex: "total_price",
            key: "total",
            align: "right",
            render: (total) => (
                <strong>{formatIDR(total)}</strong>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag className={
                    status === "paid" ? "status-paid" : "status-pending"
                }>
                <strong>{status.charAt(0).toUpperCase() + status.slice(1)}</strong>
                </Tag>
            ),
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => handleViewTransaction(record)}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEditTransaction(record)}
                        ></Button>
                    <Button
                        icon={<PrinterOutlined />}
                        onClick={() => handlePrintTransaction(record)}
                    />
                </Space>
            ),
        },
    ]

    useEffect(() => {
            // To fetch user's data from API
                (async () => {
                  const paymentMethodsResponse = await fetch(`${API_URL}/get_payment_methods`);
                  const transactionsResponse = await fetch(`${API_URL}/get_transactions`);

                  const paymentMethodsData = await paymentMethodsResponse.json();
                  const transactionsData = await transactionsResponse.json();
          
                  setPaymentMethods(paymentMethodsData);
                  setTransactions(transactionsData);
                })();
            }, [reload]);

    return (
        <div className="transactions-container">

            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="transactions-title">
                        Transactions
                    </h1>

                    <p className="transactions-subtitle">
                        Riwayat seluruh transaksi kasir.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <Card className="filter-card">

                <div className="transaction-filter">

                    <Input
                        placeholder="Cari invoice / customer..."
                        prefix={<SearchOutlined />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="transaction-search"
                    />

                    <Select
                        value={paymentMethod}
                        onChange={setPaymentMethod}
                        className="payment-select"
                        options={[
                            { label: "Semua Payment", value: "all" },
                             ...paymentMethods.map((item) => ({
                                    label: item.payment_method_name,
                                    value: item.payment_method_code,
                                })),
                        ]}
                    />

                    <RangePicker
                        format="DD/MM/YYYY"
                        className="date-filter"
                        value={dateRange}
                        onChange={(dates) => setDateRange(dates || [])}
                    />

                    <Button
                        icon={<DownloadOutlined />}
                        className="export-button"
                    >
                        Export
                    </Button>

                </div>

            </Card>

            {/* Summary */}
            <div className="summary-grid">

                <Card className="summary-card">
                    <p className="summary-label">
                        TOTAL
                    </p>

                    <h2 className="summary-value">
                        {formatIDR(totalRevenue)}
                    </h2>
                </Card>

                <Card className="summary-card">
                    <p className="summary-label">
                        JUMLAH TRANSAKSI
                    </p>

                    <h2 className="summary-value">
                        {filteredTransactions.length}
                    </h2>
                </Card>

                <Card className="summary-card">
                    <p className="summary-label">
                        RATA-RATA
                    </p>

                    <h2 className="summary-value">
                        {formatIDR(Math.round(averageRevenue))}
                    </h2>
                </Card>

            </div>

            {/* Table */}
            <Card className="table-card">

                <Table
                    columns={columns}
                    dataSource={filteredTransactions}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                    }}
                />

            </Card>

            <Modal
                title= {modalMode === "edit" ? "Edit Transaksi" : "Detail Transaksi"}
                open={openDetailModal}
                onCancel={() => {
                    setOpenDetailModal(false);
                    setSelectedTransaction(null);
                    // setModalMode("view");
                }}
                footer={null}
                centered
                width={700}
            >
                {selectedTransaction && (
                    <>
                        <div className="transaction-detail-header">
                            <div>
                                <label>ID Transaksi: </label>
                                <p>{selectedTransaction.transaction_number}</p>
                            </div>

                            <div>
                                <label>Status: </label>
                                {modalMode === "edit" ? (
                                    <Select
                                        value={selectedTransaction.status}
                                        onChange={(value) =>
                                            setSelectedTransaction((prev) => ({
                                                ...prev,
                                                status: value,
                                            }))
                                        }
                                        options={[
                                            {
                                                label: "Pending",
                                                value: "pending",
                                            },
                                            {
                                                label: "Paid",
                                                value: "paid",
                                            },
                                        ]}
                                        style={{ width: 150 }}
                                    />
                                ) : (
                                    <Tag
                                        className={
                                            selectedTransaction.status === "paid" ? "status-paid" : "status-pending"
                                        }
                                    >
                                        {selectedTransaction.status}
                                    </Tag>
                                )}
                            </div>
                        </div>

                        <div className="transaction-detail-grid">
                            <div>
                                <label>Customer</label>
                                <p>{selectedTransaction.customer_name}</p>
                            </div>
                            
                            <div>
                                <label>Pembayaran</label>
                                <p>{selectedTransaction.payment_method}</p>
                            </div>

                            <div>
                                <label>Tanggal</label>
                                <p>{selectedTransaction.transaction_date}</p>
                            </div>

                            <div>
                                <label>Kasir</label>
                                <p>{selectedTransaction.cashier_name}</p>
                            </div>
                        </div>

                        <Divider />

                        <Table
                            pagination={false}
                            size="small"
                            columns={[
                                {
                                    title: "Produk",
                                    dataIndex: "product_name",
                                },
                                {
                                    title: "Qty",
                                    dataIndex: "qty",
                                    align: "center",
                                },
                                {
                                    title: "Harga",
                                    dataIndex: "price",
                                    align: "right",
                                    render: (value) => formatIDR(value),
                                },
                                {
                                    title: "Subtotal",
                                    key: "subtotal",
                                    align: "right",
                                    render: (_, record) =>
                                        formatIDR(record.qty * record.price),
                                },
                            ]}
                            dataSource={selectedTransaction.details}
                            rowKey="id"
                        />

                        <Divider />

                        <div className="transaction-total">
                            
                            <div className="summary-row">
                                <span>Total</span>
                                <span>{formatIDR(selectedTransaction.total_price)}</span>
                            </div>

                            {/* KALAU ADA PAJAK AKTIFIN INI */}
                            {/* <div className="summary-row">
                                <span>Pajak (10%)</span>
                                <span>{formatIDR(selectedTransaction.total_price * 0.1)}</span>
                            </div>

                            <div className="summary-row">
                                <span>Total</span>
                                <span>{formatIDR(selectedTransaction.total_price + selectedTransaction.total_price * 0.1)}</span>
                            </div> */}
                        </div>

                        <div className="modal-footer">

                            <Button
                                onClick={() => setOpenDetailModal(false)}
                            >
                                Close
                            </Button>

                            {modalMode === "edit" ? (
                                <Button
                                    type="primary"
                                    onClick={() => handleSaveTransaction()}
                                >
                                    Save
                                </Button>
                            ) : (
                                <Button
                                    type="primary"
                                    icon={<PrinterOutlined />}
                                    onClick={() =>
                                        console.log(
                                            "Print Bon for transaction:",
                                            selectedTransaction
                                        )
                                    }
                                >
                                    Print Bon
                                </Button>
                            )}

                        </div>
                    </>
                )}
            </Modal>
        </div>
    )
}

export default Transactions;