from database import conn, cursor
import pymysql

def get_user_by_username(username):
    # cursor = conn.cursor(pymysql.cursors.DictCursor)
    
    sql = """SELECT u.id, u.name, u.username, u.password, u.is_active, u.role FROM user u
    LEFT JOIN role r ON r.id = u.role
    WHERE u.username = %s LIMIT 1"""
    
    cursor.execute(sql, (username,))

    return cursor.fetchone()