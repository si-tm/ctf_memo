import pandas as pd
import sqlite3

def main():
    conn = sqlite3.connect('database.db')
    cur = conn.cursor()
    cur.execute("SELECT * FROM sqlite_master WHERE type='table'")
    for x in cur.fetchall():
        print(x)
    data1 = pd.read_sql_query('SELECT * FROM user2', conn)
    data1 = pd.read_sql_query('select * from user', conn)
    # data1 = pd.read_sql_query('SELECT * FROM 2', conn)
    # data1 = pd.read_sql_query('SELECT * FROM CREATE TABLE user2 (id TEXT, password TEXT)', conn)
    print(data1)
    """
        ('table', 'user2', 'user2', 2, 'CREATE TABLE user2 (id TEXT, password TEXT)')
            id               password
        0  root  GLDmNFJimveAAxyg_wSNp
    """

if __name__ == '__main__':
    main()