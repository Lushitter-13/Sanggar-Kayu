import { Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { Card, Tag, Button } from "antd";
import dayjs from "dayjs";
import {
  ArrowUpRight,
  Boxes,
  TrendingUp,
  TrendingDown,
  Minus,
  Wallet,
  AlertTriangle,
  // Divide,
} from "lucide-react";

import "../Styles/Dashboard.css";

const API_URL = import.meta.env.VITE_API_URL;
// const products = [
//   {
//     code: "PRD001",
//     name: "Meja Kayu Jati",
//     qty: 2,
//     unit: "pcs",
//     status: "Low Stock",
//   },
//   {
//     code: "PRD002",
//     name: "Kursi Minimalis",
//     qty: 0,
//     unit: "pcs",
//     status: "Out of Stock",
//   },
// ];

// const transactions = [
//   {
//     id: "TRX001",
//     customer: "Wilson",
//     payment: "Cash",
//     total: 2500000,
//     status: "Paid",
//   },
//   {
//     id: "TRX002",
//     customer: "Michael",
//     payment: "Transfer",
//     total: 1200000,
//     status: "Pending",
//   },
//   {
//     id: "TRX003",
//     customer: "Jonathan",
//     payment: "QRIS",
//     total: 850000,
//     status: "Paid",
//   },
// ];

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
                : trend === "down"
                  ? "trend-down"
                  : "trend-neutral"
            }`}
          >
            {trend === "up" && <TrendingUp size={14} />}
            {trend === "down" && <TrendingDown size={14} />}
            {trend !== "up" && trend !== "down" && <Minus size={14} />}
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
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);

  const transactionToday = useMemo(() => {
    const today = dayjs()

    return transactions.filter((transaction) =>
    dayjs(transaction.transaction_date).isSame(today, "day"))
  }, [transactions])

  const transactionYesterday = useMemo(() => {
    const yesterday = dayjs().subtract(1, "day")

    return transactions.filter((transaction) =>
        dayjs(transaction.transaction_date).isSame(yesterday, "day")
    );
  }, [transactions])

  const transactionTodayCount = transactionToday.length;
  const transactionYesterdayCount = transactionYesterday.length;
  const transactionDifference = transactionTodayCount - transactionYesterdayCount

  const incomeToday = transactionToday.reduce(
    (total, transaction) =>
        total + Number(transaction.total_price || 0),
    0
  );

  const incomeYesterday = transactionYesterday.reduce(
    (total, transaction) =>
        total + Number(transaction.total_price || 0),
    0
  );

  const incomeDifference =
    incomeYesterday === 0
      ? 0
      : incomeToday - incomeYesterday;

  const incomeDifferencePercentage =
    incomeYesterday === 0
      ? 0
      : (incomeDifference / incomeYesterday) * 100;

  const newProducts = products.filter((product) =>
    dayjs(product.created_at).isSame(dayjs(), "day")
  );

  const newProductsCount = newProducts.length

  const lowStock = products
  .filter(product => product.qty <= 5)
  .sort((a, b) => a.qty - b.qty);

  // console.log("TODAY: ", transactionTodayCount)
  // console.log("YESTERDAY: ", transactionYesterdayCount)
  // console.log("DIFFERENCE: ", transactionDifference)

  useEffect(() => {
    (async () => {
      const today = dayjs();
      const yesterday = dayjs().subtract(1, "day");
      const tomorrow = today.add(1, "day");

      const transactionResponse = await fetch (`${API_URL}/get_transactions?start_date=${yesterday.format("YYYY-MM-DD")}&end_date=${tomorrow.format("YYYY-MM-DD")}`)
      const transactionData = await transactionResponse.json()

      const productResponse = await fetch(`${API_URL}/get_products`)
      const productData = await productResponse.json()

      // console.log("DATA TRANSAKSI: ", transactionData)
      // console.log("DATA PRODUK: ", productData)

      setTransactions(transactionData)
      setProducts(productData)
    })();
  }, [])

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

        <Link to = "/pos">
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
          value={formatIDR(incomeToday)}
          delta={`${incomeDifference >= 0 ? "+" : ""}${incomeDifferencePercentage.toFixed(1)}% vs kemarin`}
          trend={incomeDifference >= 0 ? "up" : "down"}
          icon={Wallet}
        />

        <StatCard
          label="TRANSAKSI HARI INI"
          value={transactionTodayCount}
          delta={`${transactionDifference >= 0 ? "+" : ""}${transactionDifference} transaksi`}
          trend={transactionDifference >= 0 ? "up" : "down"}
          icon={TrendingUp}
        />

        <StatCard
          label="TOTAL SKU"
          value={products.length}
          delta={`${newProductsCount > 0 ? `+ ${newProductsCount} produk baru` : "Tidak ada produk baru"}`}
          trend={newProductsCount > 0 ? "up" : "neutral"}
          icon={Boxes}
        />

        <StatCard
          label="STOK MENIPIS"
          value={String(lowStock.length)}
          delta={`${lowStock.length > 0 ? `${lowStock.length} item perlu restock` : "Semua stok aman"}`}
          trend= {lowStock.length > 0 ? "down" : "neutral"}
          icon={AlertTriangle}
        />

      </div>
      
      {/* Content */}
      <div className="content-grid">
        
        {/* Transaction */}
        <Card className="transaction-card">
          <div className="card-header">
            <h2>Transaksi Terbaru</h2>

            <Link to="/transactions">Lihat Semua</Link>
          </div>
          <div className="transaction-list">
            {transactions.map((transaction) => (

              <div className="transaction-item" key={transaction.id}>
                <div>
                  <p className="transaction-customer">
                    {transaction.customer_name}
                  </p>

                  <p className="transaction-meta">
                    {transaction.id} • {transaction.payment_method_code}
                  </p>
                </div>

                <div className="transaction-right">
                  <p className="transaction-total">
                    {formatIDR(transaction.total_price)}
                  </p>
                  <Tag
                    className={
                      transaction.status === "paid"
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
                    product.qty === 0
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