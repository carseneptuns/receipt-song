"""
Database connection helper for MySQL using PyMySQL.
Provides a single get_connection() used by every model, plus a
schema initializer so the app can bootstrap its own tables.
"""
import pymysql
import pymysql.cursors
from config import Config


def get_connection():
    """Return a new PyMySQL connection with dict-style cursors."""
    return pymysql.connect(
        host=Config.DB_HOST,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        database=Config.DB_NAME,
        port=Config.DB_PORT,
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=False,
    )


SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS receipts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL DEFAULT 'RECEIPTSONG',
    name VARCHAR(255) NOT NULL DEFAULT 'Guest',
    store_name VARCHAR(255) NOT NULL DEFAULT 'RECEIPTSONG',
    receipt_date VARCHAR(20) NOT NULL,
    receipt_time VARCHAR(20) NOT NULL,
    footer VARCHAR(255) NOT NULL DEFAULT 'THANK YOU ♡',
    theme VARCHAR(50) NOT NULL DEFAULT 'classic',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS songs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    receipt_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    album VARCHAR(255) DEFAULT '',
    duration VARCHAR(10) NOT NULL,
    album_cover TEXT,
    position INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_songs_receipt FOREIGN KEY (receipt_id)
        REFERENCES receipts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
"""


def init_db():
    """Create the database (if missing) and tables. Called on app startup."""
    # First connect without a database to make sure it exists.
    root_conn = pymysql.connect(
        host=Config.DB_HOST,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        port=Config.DB_PORT,
        cursorclass=pymysql.cursors.DictCursor,
    )
    try:
        with root_conn.cursor() as cursor:
            cursor.execute(
                f"CREATE DATABASE IF NOT EXISTS `{Config.DB_NAME}` "
                "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
            )
        root_conn.commit()
    finally:
        root_conn.close()

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            for statement in SCHEMA_SQL.strip().split(";"):
                statement = statement.strip()
                if statement:
                    cursor.execute(statement)
        conn.commit()
    finally:
        conn.close()
