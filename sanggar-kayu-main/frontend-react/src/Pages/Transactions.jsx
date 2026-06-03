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
  CalendarOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import { useMemo, useState } from "react";

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
        status: "Paid",
    },
    {
        id: 2,
        transaction_number: "TRX002",
        customer_name: "Andi",
        date: "02/06/2026",
        payment_method: "qris",
        total: 1800000,
        status: "Pending",
    },
    {
        id: 3,
        transaction_number: "TRX003",
        customer_name: "Asep",
        date: "03/06/2026",
        payment_method: "debit",
        total: 2500000,
        status: "Paid",
    },
    {
        id: 4,
        transaction_number: "TRX004",
        customer_name: "Tatang",
        date: "04/06/2026",
        payment_method: "giro",
        total: 1800000,
        status: "Pending",
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
                <Tag>{payment}</Tag>
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
                <Tag color={status === "Paid" ? "green" : "orange"}>
                {status}
                </Tag>
            ),
        },
    ]

    return (
        <div className="transactions-container">

            {/* Header */}
            <div className="transactions-header">
                <h1>Transactions</h1>

                <p className="transactions-title">Riwayat seluruh transaksi kasir.</p>
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
                    {
                        label: "Semua Payment",
                        value: "all",
                    },
                    {
                        label: "Cash",
                        value: "Cash",
                    },
                    {
                        label: "QRIS",
                        value: "QRIS",
                    },
                    {
                        label: "BCA Transfer",
                        value: "BCA Transfer",
                    },
                    {
                        label: "BRI Transfer",
                        value: "BRI Transfer",
                    },
                    {
                        label: "Cek Giro",
                        value: "Cek Giro",
                    },
                    ]}
                />

                <RangePicker
                    format="DD/MM/YYYY"
                    className="date-filter"
                />

                <Button
                    icon={<DownloadOutlined />}
                >
                    Export
                </Button>

                </div>

            </Card>

        </div>
    )
}