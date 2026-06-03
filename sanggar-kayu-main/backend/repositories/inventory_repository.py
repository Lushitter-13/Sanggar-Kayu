from database import conn, cursor
import pymysql

# PRODUCTS
def get_products(product_id=None, product_code=None, product_name=None):
    query = "SELECT * FROM products WHERE 1=1"
    params = []
    
    if product_id is not None:
        query += " AND id = %s"
        params.append(product_id)
        
    if product_code is not None:
        query += " AND code = %s"
        params.append(product_code)
        
    if product_name is not None:
        query += " AND name = %s"
        params.append(product_name)

    cursor.execute(query, params)

    return cursor.fetchall()

def add_product(product_code, product_name, category_id, qty, price_sell, price_promo=0, description=None):

    sql = """
    INSERT INTO product(code, name, category_id, qty, price_sell, price_promo, description)
    VALUES(%s, %s, %s, %s, %s, %s, %s)
    """

    cursor.execute(sql, (product_code, product_name, category_id, qty, price_sell, price_promo, description))
    conn.commit()

def update_product(product_id, product_code, product_name, category_id, qty, price_sell, price_promo=0, description=None):
    try:
        sql ="""UPDATE product SET
        code = %s,
        name = %s,
        category_id = %s,
        qty = %s,
        price_sell = %s,
        price_promo = %s,
        description = %s
        WHERE id = %s
        """
        affected_rows = cursor.execute(sql, (product_code, product_name, category_id, qty, price_sell, price_promo, description, product_id))
        conn.commit()
        return affected_rows

    except Exception as e:
        conn.rollback()
        print(e)
        return False
    
def delete_product(product_id):
    try:
        sql = "DELETE FROM product WHERE id = %s"
        affected_rows = cursor.execute(sql, (product_id,))
        conn.commit()
        return affected_rows

    except Exception as e:
        conn.rollback()
        print(e)
        return False
    
# TRANSACTIONS
def get_transactions(id=None, transaction_number=None, customer_name=None):
    query = "SELECT * FROM transaction WHERE 1=1"
    params = []
    
    if id is not None:
        query += " AND id = %s"
        params.append(id)
        
    if transaction_number is not None:
        query += " AND number = %s"
        params.append(transaction_number)

    if customer_name is not None:
        query += " AND customer_name = %s"
        params.append(customer_name)

    cursor.execute(query, params)

    return cursor.fetchall()

def add_transaction(
    transaction_number,
    customer_name,
    payment_method,
    total_price,
    transaction_date,
    notes=None,
    details=None
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
            payment_method,
            total_price,
            transaction_date,
            notes
        )
        VALUES
        (
            %s, %s, %s, %s, %s, %s
        )
        """

        cursor.execute(
            sql_transaction,
            (
                transaction_number,
                customer_name,
                payment_method,
                total_price,
                transaction_date,
                notes,
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
    
def updateStock(id, qty):
    try:
        sql = """
        UPDATE product
        SET qty = %s
        WHERE id = %s
        """
        affected_rows = cursor.execute(sql, (qty, id))
        conn.commit()
        return affected_rows

    except Exception as e:
        conn.rollback()
        print(e)
        return False