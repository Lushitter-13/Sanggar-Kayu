import { Link } from "react-router-dom";
import { Card, Tag, Button } from "antd";
import {
  ArrowUpRight,
  Boxes,
  TrendingUp,
  Wallet,
  AlertTriangle,
  // Divide,
} from "lucide-react";

import "../Styles/Dashboard.css";

// Dummy Data
const products = [
  {
    code: "PRD001",
    name: "Meja Kayu Jati",
    qty: 2,
    unit: "pcs",
    status: "Low Stock",
  },
  {
    code: "PRD002",
    name: "Kursi Minimalis",
    qty: 0,
    unit: "pcs",
    status: "Out of Stock",
  },
];

const transactions = [
  {
    id: "TRX001",
    customer: "Wilson",
    payment: "Cash",
    total: 2500000,
    status: "Paid",
  },
  {
    id: "TRX002",
    customer: "Michael",
    payment: "Transfer",
    total: 1200000,
    status: "Pending",
  },
  {
    id: "TRX003",
    customer: "Jonathan",
    payment: "QRIS",
    total: 850000,
    status: "Paid",
  },
];

const formatIDR = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
};

function StatCard ({ label, value, delta, trend, icon: Icon}) {
  return (
    <Card className="stat-card">
      <div className="stat-card-top">
        <div>
          <p className="stat-label">{label}</p>
          <h2 className="stat-value">{value}</h2>

          <div
            className={`stat-delta ${
              trend === "up"
                ? "trend-up"
                : "trend-down"
            }`}
          >
            <TrendingUp size={14} />
            <span>{delta}</span>
          </div>

        </div>
        <div className="stat-icon-wrapper">
          <Icon size={22} />
        </div>
      </div>
    </Card>
  )
}

const Dashboard = () => {
  const lowStock = products. filter((p) => p.status !== "Active");

  return (
    <div className="dashboard-container">

      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Selamat Datang Kembali</h1>

          <p className="dashboard-subtitle">
            Ringkasan operasional toko hari ini.
          </p>
        </div>

        <Link to = "/transactions">
          <Button type="primary" className="cashier-button">
            Open Cashier
            <ArrowUpRight size={16} />
          </Button>
        </Link>
      </div>

      {/* STAT */}
      <div className="stats-grid">

        <StatCard
          label="PENDAPATAN HARI INI"
          value={formatIDR(9995000)}
          delta="+12.4% vs kemarin"
          trend="up"
          icon={Wallet}
        />

        <StatCard
          label="TRANSAKSI"
          value="24"
          delta="+3 transaksi"
          trend="up"
          icon={TrendingUp}
        />

        <StatCard
          label="TOTAL SKU"
          value="120"
          delta="+1 produk baru"
          trend="up"
          icon={Boxes}
        />

        <StatCard
          label="STOK MENIPIS"
          value={String(lowStock.length)}
          delta="Perlu restock"
          trend= {lowStock.length > 0 ? "down" : "up"}
          icon={AlertTriangle}
        />

      </div>
      
      {/* Content */}
      <div className="content-grid">
        
        {/* Transaction */}
        <Card className="transaction-card">
          <div className="card-header">
            <h2>Transaksi Terbaru</h2>

            <Link to="/transaction">Lihat Semua</Link>
          </div>
          <div className="transaction-list">
            {transactions.map((transaction) => (

              <div className="transaction-item" key={transaction.id}>
                <div>
                  <p className="transaction-customer">
                    {transaction.customer}
                  </p>

                  <p className="transaction-meta">
                    {transaction.id} • {transaction.payment}
                  </p>
                </div>

                <div className="transaction-right">
                  <p className="transaction-total">
                    {formatIDR(transaction.total)}
                  </p>
                  <Tag
                    className={
                      transaction.status === "Paid"
                      ? "dashboard-status-paid"
                      : "dashboard-status-pending"
                    }
                  >
                    {transaction.status}
                  </Tag>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Low Stock */}
        <Card className="lowstock-card">

          <h2 className="lowstock-title">
            Perlu Perhatian
          </h2>

          <div className="lowstock-list">

            {lowStock.map((product) => (

              <div
                className="lowstock-item"
                key={product.code}
              >

                <div>

                  <p className="lowstock-name">
                    {product.name}
                  </p>

                  <p className="lowstock-code">
                    {product.code}
                  </p>

                </div>

                <Tag
                  className={
                    product.status === "Out of Stock"
                      ? "stock-tag danger"
                      : "stock-tag warning"
                  }
                >
                  {product.qty} {product.unit}
                </Tag>

              </div>

            ))}

          </div>

        </Card>
      </div>

    </div>
  )
}

export default Dashboard;