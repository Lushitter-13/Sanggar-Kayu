import {
  Card,
  Input,
  Button,
  Table,
  Tag,
  Select,
  DatePicker,
} from "antd";

import {
  SearchOutlined,
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
    },
    {
        id: 2,
        transaction_number: "TRX002",
        customer_name: "Andi",
        date: "02/06/2026",
        payment_method: "qris",
        total: 1800000,
        status: "pending",
    },
    {
        id: 3,
        transaction_number: "TRX003",
        customer_name: "Asep",
        date: "03/06/2026",
        payment_method: "debit",
        total: 2500000,
        status: "paid",
    },
    {
        id: 4,
        transaction_number: "TRX004",
        customer_name: "Tatang",
        date: "04/06/2026",
        payment_method: "giro",
        total: 1800000,
        status: "pending",
    },
    {
        id: 5,
        transaction_number: "TRX005",
        customer_name: "Tatang",
        date: "04/06/2026",
        payment_method: "giro",
        total: 1800000,
        status: "pending",
    },
    {
        id: 6,
        transaction_number: "TRX006",
        customer_name: "Tatang",
        date: "04/06/2026",
        payment_method: "giro",
        total: 1800000,
        status: "pending",
    },
    {
        id: 7,
        transaction_number: "TRX007",
        customer_name: "Tatang",
        date: "04/06/2026",
        payment_method: "giro",
        total: 1800000,
        status: "pending",
    },
    {
        id: 8,
        transaction_number: "TRX008",
        customer_name: "Tatang",
        date: "04/06/2026",
        payment_method: "giro",
        total: 1800000,
        status: "pending",
    },
    {
        id: 9,
        transaction_number: "TRX009",
        customer_name: "Tatang",
        date: "04/06/2026",
        payment_method: "giro",
        total: 1800000,
        status: "pending",
    },
    {
        id: 10,
        transaction_number: "TRX010",
        customer_name: "Tatang",
        date: "04/06/2026",
        payment_method: "giro",
        total: 1800000,
        status: "pending",
    },
    {
        id: 11,
        transaction_number: "TRX011",
        customer_name: "Tatang",
        date: "04/06/2026",
        payment_method: "giro",
        total: 1800000,
        status: "pending",
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

        </div>
    )
}

export default Transactions;