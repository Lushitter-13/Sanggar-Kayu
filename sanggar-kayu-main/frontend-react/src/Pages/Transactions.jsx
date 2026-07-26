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
//   CalendarOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import { useMemo, useState } from "react";

import "../Styles/Transactions.css";

const { RangePicker } = DatePicker;

// Dummy Data
const transactionsData = [
    {
        id: 1,
        transaction_number: "TRX001",
        customer_name: "Budi",
        date: "01/06/2026",
        payment_method: "cash",
        total: 2500000,
        status: "paid",
        cashier: "Wilson",
    },
    {
        id: 2,
        transaction_number: "TRX002",
        customer_name: "Andi",
        date: "02/06/2026",
        payment_method: "qris",
        total: 1800000,
        status: "pending",
        cashier: "Tatang",
    },
    {
        id: 3,
        transaction_number: "TRX003",
        customer_name: "Asep",
        date: "03/06/2026",
        payment_method: "debit",
        total: 2500000,
        status: "paid",
        cashier: "Dadang",
    },
    {
        id: 4,
        transaction_number: "TRX004",
        customer_name: "Tatang",
        date: "04/06/2026",
        payment_method: "giro",
        total: 1800000,
        status: "pending",
        cashier: "Asep",
    },
    {
        id: 5,
        transaction_number: "TRX005",
        customer_name: "Tatang",
        date: "04/06/2026",
        payment_method: "giro",
        total: 1800000,
        status: "pending",
        cashier: "Tatang",
    },
    {
        id: 6,
        transaction_number: "TRX006",
        customer_name: "Tatang",
        date: "04/06/2026",
        payment_method: "giro",
        total: 1800000,
        status: "pending",
        cashier: "Dadang",
    },
    {
        id: 7,
        transaction_number: "TRX007",
        customer_name: "Tatang",
        date: "04/06/2026",
        payment_method: "giro",
        total: 1800000,
        status: "pending",
        cashier: "Kuncen",
    },
    {
        id: 8,
        transaction_number: "TRX008",
        customer_name: "Tatang",
        date: "04/06/2026",
        payment_method: "giro",
        total: 1800000,
        status: "pending",
        cashier: "Sule",
    },
    {
        id: 9,
        transaction_number: "TRX009",
        customer_name: "Tatang",
        date: "04/06/2026",
        payment_method: "giro",
        total: 1800000,
        status: "pending",
        cashier: "Cangcut",
    },
    {
        id: 10,
        transaction_number: "TRX010",
        customer_name: "Tatang",
        date: "04/06/2026",
        payment_method: "giro",
        total: 1800000,
        status: "pending",
        cashier: "Tatang",
    },
    {
        id: 11,
        transaction_number: "TRX011",
        customer_name: "Tatang",
        date: "04/06/2026",
        payment_method: "giro",
        total: 1800000,
        status: "pending",
        cashier: "Atep",
    },
]

const formatIDR = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
}

const Transactions = () => {
    const [search, setSearch] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("all");
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const filteredTransactions = useMemo(() => {
        return transactionsData.filter((transaction) => {
            const matchPayment =
                paymentMethod === "all" ||
                transaction.payment_method === paymentMethod;
                
            const matchSearch =
                search ==="" ||
                transaction.transaction_number.toLowerCase().includes(search.toLowerCase()) ||
                transaction.customer_name.toLowerCase().includes(search.toLowerCase());

            return matchPayment && matchSearch;            
        })
    }, [search, paymentMethod]);

    const totalRevenue = filteredTransactions.reduce((acc, item) => acc + item.total, 0);
    const averageRevenue = filteredTransactions.length > 0 ? totalRevenue / filteredTransactions.length : 0;

    const handleViewTransaction = (record) => {
        console.log("View transaction:", record);
        setSelectedTransaction(record);
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
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Payment",
            dataIndex: "payment_method",
            key: "payment_method",
            render: (payment) => (
                <Tag className="payment-tag"><strong>{payment === "qris" ? "QRIS" : payment.charAt(0).toUpperCase() + payment.slice(1)}</strong></Tag>
            ),
        },
        {
            title: "Total",
            dataIndex: "total",
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
                        icon={<PrinterOutlined />}
                        onClick={() => handlePrintTransaction(record)}
                    />
                </Space>
            ),
        },
    ]

    return (
        <div className="transactions-container">

            {/* Header */}
            <div className="transactions-header">
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
                            { label: "Cash", value: "cash" },
                            { label: "QRIS", value: "qris" },
                            { label: "Debit", value: "debit" },
                            { label: "Cek Giro", value: "giro" },
                        ]}
                    />

                    <RangePicker
                        format="DD/MM/YYYY"
                        className="date-filter"
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
                title="Detail Transaksi"
                open={openDetailModal}
                onCancel={() => {
                    setOpenDetailModal(false);
                    setSelectedTransaction(null);
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
                                <p>{selectedTransaction.id}</p>
                            </div>

                            <div>
                                <label>Status: </label>
                                <Tag
                                    className={
                                        selectedTransaction.status === "paid" ? "status-paid" : "status-pending"
                                    }
                                >
                                    {selectedTransaction.status}
                                </Tag>
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
                                <p>{selectedTransaction.cashier}</p>
                            </div>
                        </div>

                        <Divider />

                        <Table
                            pagination={false}
                            size="small"
                            columns={[
                                {
                                    title: "Produk",
                                    dataIndex: "name",
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
                                <span>{formatIDR(selectedTransaction.total)}</span>
                            </div>

                            <div className="summary-row">
                                <span>Pajak</span>
                                <span>{formatIDR(selectedTransaction.total * 0.1)}</span>
                            </div>

                            <div className="summary-row">
                                <span>Total</span>
                                <span>{formatIDR(selectedTransaction.total + selectedTransaction.total * 0.1)}</span>
                            </div>
                        </div>

                        <div className="modal-footer">

                            <Button
                                onClick={() => setOpenDetailModal(false)}
                            >
                                Close
                            </Button>

                            <Button
                                type="primary"
                                icon={<PrinterOutlined />}
                                // onClick={() => handlePrint(selectedTransaction)}
                                onClick={() => console.log("Print Bon for transaction:", selectedTransaction)}
                            >
                                Print Bon
                            </Button>

                        </div>
                    </>
                )}
            </Modal>
        </div>
    )
}

export default Transactions;