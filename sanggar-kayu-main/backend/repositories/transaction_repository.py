from database import conn, cursor
import pymysql
from datetime import datetime

def get_transactions(id=None, transaction_number=None, customer_name=None, start_date=None, end_date=None):
    query = """SELECT
    t.*, td.product_id, p.name AS product_name, td.qty, td.price, td.total AS detail_total, pm.payment_method_name AS payment_method, pm.payment_method_code AS payment_method_code, u.name AS cashier_name
    FROM transaction t
    LEFT JOIN transaction_detail td ON t.id = td.transaction_id
    LEFT JOIN product p ON td.product_id = p.id
    LEFT JOIN payment_method pm ON t.payment_method_id = pm.id
    LEFT JOIN user u ON t.user_id = u.id
    WHERE 1=1"""
    params = []
    
    if id is not None:
        query += " AND t.id = %s"
        params.append(id)
        
    if transaction_number is not None:
        query += " AND t.transaction_number LIKE %s"
        params.append(transaction_number)

    if customer_name is not None:
        query += " AND t.customer_name LIKE %s"
        params.append(customer_name)
        
    if start_date is not None:
        query += " AND t.date >= %s"
        params.append(start_date)
        
    if end_date is not None:
        query += " AND t.date < %s"
        params.append(end_date)

    query += " ORDER BY t.date DESC"
    
    cursor.execute(query, params)

    rows = cursor.fetchall()
    
    transactions = {}
    
    for row in rows:
        transaction_id = row["id"]
        
        if transaction_id not in transactions:
            transactions[transaction_id] = {
                "id": transaction_id,
                "transaction_number": row["transaction_number"],
                "cashier_name": row["cashier_name"],
                "customer_name": row["customer_name"],
                "payment_method": row["payment_method"],
                "payment_method_code": row["payment_method_code"],
                "total_price": row["total"],
                "transaction_date": row["date"],
                "notes": row["notes"],
                "status": row["status"],
                "details": []
            }
        
        transactions[transaction_id]["details"].append({
            "product_id": row["product_id"],
            "product_name": row["product_name"],
            "qty": row["qty"],
            "price": row["price"],
            "total": row["detail_total"]
        })
    
    return list(transactions.values())

def generate_transaction_number():
    year = datetime.now().year
    
    cursor.execute("""
        SELECT MAX(
            CAST(SUBSTRING_INDEX(transaction_number, '-', -1) AS UNSIGNED)
        ) AS last_number
        FROM transaction
        WHERE transaction_number LIKE %s
    """, (f"INV-{year}-%",))

    result = cursor.fetchone()

    sequence = (result["last_number"] or 0) + 1

    return f"INV-{year}-{sequence:04d}"

def add_transaction(
    transaction_number,
    customer_name,
    user_id,
    payment_method,
    total_price,
    transaction_date,
    status,
    notes=None,
    details=None,
):
    
    if details is None:
        details = []

    try:

        # =========================
        # INSERT HEADER TRANSACTION
        # =========================

        sql_transaction = """
        INSERT INTO transaction
        (
            transaction_number,
            customer_name,
            user_id,
            payment_method_id,
            total,
            date,
            notes,
            status
        )
        VALUES
        (
            %s, %s, %s, %s, %s, %s, %s, %s
        )
        """

        cursor.execute(
            sql_transaction,
            (
                transaction_number,
                customer_name,
                user_id,
                payment_method,
                total_price,
                transaction_date,
                notes,
                status,
            ),
        )

        # ambil id transaksi yang baru dibuat
        transaction_id = cursor.lastrowid

        # =========================
        # INSERT DETAIL TRANSACTION
        # =========================

        sql_detail = """
        INSERT INTO transaction_detail
        (
            transaction_id,
            product_id,
            qty,
            price,
            total
        )
        VALUES
        (
            %s, %s, %s, %s, %s
        )
        """

        # =========================
        # UPDATE STOCK
        # =========================

        sql_update_stock = """
        UPDATE product
        SET qty = qty - %s
        WHERE id = %s
        """

        for detail in details:

            cursor.execute(
                sql_detail,
                (
                    transaction_id,
                    detail["product_id"],
                    detail["qty"],
                    detail["price"],
                    detail["total"],
                ),
            )

            cursor.execute(
                sql_update_stock,
                (
                    detail["qty"],
                    detail["product_id"],
                ),
            )

        conn.commit()

        return {
            "status": True,
            "code": 200,
            "message": "Transaction created successfully",
            "transaction_id": transaction_id,
        }

    except Exception as e:

        conn.rollback()

        return {
            "status": False,
            "code": 500,
            "message": str(e),
        }
        
def update_transaction(id, status):
    try:
        query = """
        UPDATE transaction SET status = %s
        WHERE id = %s
        """
        
        affected_rows = cursor.execute(query, (status, id))
        conn.commit()
        return affected_rows
    
    except Exception as e:
            conn.rollback()
            print(e)
            return False