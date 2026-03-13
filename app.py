from flask import Flask, request, jsonify, render_template_string, redirect
from flask_cors import CORS
import sqlite3
import json

app = Flask(__name__)
CORS(app)  # Allow frontend to send requests to this backend

DB_NAME = 'temple_database.db'

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS forms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            form_type TEXT NOT NULL,
            form_data JSON NOT NULL,
            submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/api/submit', methods=['POST'])
def submit_form():
    data = request.json
    form_type = data.get('type')
    form_data = data.get('data')

    if not form_type or not form_data:
        return jsonify({'error': 'Invalid request data'}), 400

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO forms (form_type, form_data)
        VALUES (?, ?)
    ''', (form_type, json.dumps(form_data)))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Form submitted successfully!'}), 201

@app.route('/api/delete/<int:item_id>', methods=['POST'])
def delete_submission(item_id):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM forms WHERE id = ?', (item_id,))
    conn.commit()
    conn.close()
    return redirect('/dashboard')

# Dashboard to view the submitted forms
@app.route('/dashboard', methods=['GET'])
def view_dashboard():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('SELECT id, form_type, form_data, submitted_at FROM forms ORDER BY submitted_at DESC')
    rows = cursor.fetchall()
    conn.close()

    dashboard_html = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Temple Database Dashboard</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
        <style>body { font-family: 'Poppins', sans-serif; }</style>
    </head>
    <body class="bg-gray-100 text-gray-800 p-8">
        <div class="max-w-6xl mx-auto">
            <h1 class="text-3xl font-bold mb-8 text-orange-700">Temple Database Dashboard</h1>
            
            {% if submissions %}
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-orange-600 text-white">
                                <th class="py-3 px-4 border-b">ID</th>
                                <th class="py-3 px-4 border-b">Form Type (Collection)</th>
                                <th class="py-3 px-4 border-b">Submitted Data</th>
                                <th class="py-3 px-4 border-b">Date & Time</th>
                                <th class="py-3 px-4 border-b text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {% for row in submissions %}
                            <tr class="hover:bg-gray-50 border-b">
                                <td class="py-3 px-4">{{ row[0] }}</td>
                                <td class="py-3 px-4 font-semibold text-orange-600">{{ row[1] }}</td>
                                <td class="py-3 px-4 text-sm max-w-md">
                                    <pre class="whitespace-pre-wrap font-mono bg-gray-100 p-2 rounded border">{{ row[2] }}</pre>
                                </td>
                                <td class="py-3 px-4 text-sm text-gray-500">{{ row[3] }}</td>
                                <td class="py-3 px-4 text-center">
                                    <form action="/api/delete/{{ row[0] }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this booking?');">
                                        <button type="submit" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition duration-200">Delete</button>
                                    </form>
                                </td>
                            </tr>
                            {% endfor %}
                        </tbody>
                    </table>
                </div>
            {% else %}
                <div class="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
                    No submissions found in the database.
                </div>
            {% endif %}
        </div>
    </body>
    </html>
    """
    
    # Format the JSON better for display
    formatted_rows = []
    for row in rows:
        formatted_rows.append((row[0], row[1], json.dumps(json.loads(row[2]), indent=2), row[3]))
        
    return render_template_string(dashboard_html, submissions=formatted_rows)

if __name__ == '__main__':
    init_db()
    print("=========================================================")
    print("BACKEND SERVER IS RUNNING!")
    print("View your forms submissions at: http://127.0.0.1:5000/dashboard")
    print("=========================================================")
    app.run(debug=True, port=5000)
