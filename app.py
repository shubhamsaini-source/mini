from flask import Flask, render_template, request, jsonify
from classifier import load_model, classify_ticket
from datetime import datetime
import json, os

app = Flask(__name__)
model = load_model()

HISTORY_FILE = "history.json"

def load_history():
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE) as f:
            return json.load(f)
    return []

def save_history(history):
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/history")
def history_page():
    return render_template("history.html")

@app.route("/analytics")
def analytics_page():
    return render_template("analytics.html")

@app.route("/about")
def about_page():
    return render_template("about.html")

@app.route("/classify", methods=["POST"])
def classify():
    data = request.get_json()
    text = data.get("text", "").strip()
    if not text:
        return jsonify({"error": "Please enter a support ticket."}), 400

    result = classify_ticket(text, model)
    result["mode"] = "ml"
    result["ticket_text"] = text
    result["timestamp"] = datetime.now().strftime("%d %b %Y, %I:%M %p")

    history = load_history()
    history.insert(0, result)
    save_history(history[:100])
    return jsonify(result)

@app.route("/api/history")
def api_history():
    return jsonify(load_history())

@app.route("/api/analytics")
def api_analytics():
    history = load_history()
    from collections import Counter
    cats = [h["category"] for h in history]
    priorities = [h["priority"] for h in history]
    cat_counts = dict(Counter(cats))
    pri_counts = dict(Counter(priorities))
    avg_conf = round(sum(h["confidence"] for h in history) / len(history), 1) if history else 0
    return jsonify({
        "total": len(history),
        "categories": cat_counts,
        "priorities": pri_counts,
        "avg_confidence": avg_conf
    })

@app.route("/api/clear_history", methods=["POST"])
def clear_history():
    save_history([])
    return jsonify({"status": "cleared"})

if __name__ == "__main__":
    app.run(debug=True)
