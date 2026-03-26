import sqlite3

DB_FILE = "timeline_history.db"

def init_db():
    with sqlite3.connect(DB_FILE) as conn:
        conn.execute('''CREATE TABLE IF NOT EXISTS records
                        (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, content TEXT)''')

def insert_record(record_type, content):
    with sqlite3.connect(DB_FILE) as conn:
        conn.execute("INSERT INTO records (type, content) VALUES (?, ?)", (record_type, content))

def get_new_records(after_id):
    with sqlite3.connect(DB_FILE) as conn:
        cur = conn.cursor()
        cur.execute("SELECT id, type, content FROM records WHERE id > ? ORDER BY id ASC", (after_id,))
        # 直接把元组转换成字典列表，方便外层直接当 JSON 发送
        return [{"id": r[0], "type": r[1], "content": r[2]} for r in cur.fetchall()]

def update_record(item_id, content):
    with sqlite3.connect(DB_FILE) as conn:
        conn.execute("UPDATE records SET content = ? WHERE id = ?", (content, item_id))

def delete_record(item_id):
    with sqlite3.connect(DB_FILE) as conn:
        conn.execute("DELETE FROM records WHERE id = ?", (item_id,))

def clear_all_records():
    with sqlite3.connect(DB_FILE) as conn:
        conn.execute("DELETE FROM records")