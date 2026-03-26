from flask import Flask, request, jsonify, render_template
import logging
import threading
import webbrowser
import time
import socket
import database  # 引入我们刚才自己写的数据库模块

# 屏蔽烦人的 Flask 默认运行日志
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)

# 初始化数据库
database.init_db()


# ==========================================
# 🔌 网络接口层 (Controller)
# ==========================================

@app.route('/')
def index():
    # 使用 render_template，Flask 会自动去 templates 文件夹下读取 index.html
    return render_template('index.html')


@app.route('/receive', methods=['POST'])
def receive_data():
    if request.json and 'html_content' in request.json:
        database.insert_record('text', request.json['html_content'])
        return jsonify({"status": "success"}), 200
    return jsonify({"status": "error"}), 400


@app.route('/receive_image', methods=['POST'])
def receive_image():
    if request.json and 'image_base64' in request.json:
        database.insert_record('image', request.json['image_base64'])
        return jsonify({"status": "success"}), 200
    return jsonify({"status": "error"}), 400


@app.route('/get_new', methods=['GET'])
def get_new():
    after_id = int(request.args.get('after_id', 0))
    records = database.get_new_records(after_id)
    return jsonify(records)


@app.route('/update_item', methods=['POST'])
def update_item():
    item_id = request.json.get('id')
    new_content = request.json.get('content')
    database.update_record(item_id, new_content)
    return jsonify({"status": "success"}), 200


@app.route('/delete_item', methods=['POST'])
def delete_item():
    item_id = request.json.get('id')
    database.delete_record(item_id)
    return jsonify({"status": "success"}), 200


@app.route('/clear_all', methods=['POST'])
def clear_all():
    database.clear_all_records()
    return jsonify({"status": "cleared"}), 200


# ==========================================
# 🚀 引擎启动逻辑
# ==========================================

def open_browser():
    time.sleep(1.5)
    webbrowser.open('http://127.0.0.1:5000')


if __name__ == '__main__':
    print("=" * 50)
    print("🚀 渲染基地 (模块化架构) 启动中...")
    print("=" * 50)

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('127.0.0.1', 5000))
    if result == 0:
        print("❌ 致命错误：5000 端口已被占用！")
        input("按任意键退出...")
    else:
        threading.Thread(target=open_browser).start()
        app.run(host='127.0.0.1', port=5000, debug=False)