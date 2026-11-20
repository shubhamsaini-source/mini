from naive_bayes import NaiveBayesClassifier

CATEGORY_INFO = {
    "Billing": {
        "icon": "💳", "color": "#e74c3c",
        "description": "Payment, invoice, refund related issues",
        "priority": "High", "response_time": "2-4 hours"
    },
    "Technical Support": {
        "icon": "🔧", "color": "#3498db",
        "description": "App errors, bugs, login and performance issues",
        "priority": "High", "response_time": "1-3 hours"
    },
    "Account Management": {
        "icon": "👤", "color": "#9b59b6",
        "description": "Profile, password, account settings",
        "priority": "Medium", "response_time": "4-8 hours"
    },
    "Shipping & Delivery": {
        "icon": "📦", "color": "#e67e22",
        "description": "Order tracking, delivery and return issues",
        "priority": "Medium", "response_time": "4-6 hours"
    },
    "General Inquiry": {
        "icon": "💬", "color": "#27ae60",
        "description": "General questions and information requests",
        "priority": "Low", "response_time": "24 hours"
    }
}

def load_model():
    return NaiveBayesClassifier.load("model/classifier.json")

def classify_ticket(text: str, model) -> dict:
    prediction = model.predict([text])[0]
    probabilities = model.predict_proba([text])[0]
    classes = model.classes_

    confidence = round(max(probabilities) * 100, 2)
    all_scores = {
        cls: round(prob * 100, 2)
        for cls, prob in zip(classes, probabilities)
    }

    info = CATEGORY_INFO[prediction]
    return {
        "category": prediction,
        "confidence": confidence,
        "icon": info["icon"],
        "color": info["color"],
        "description": info["description"],
        "priority": info["priority"],
        "response_time": info["response_time"],
        "all_scores": dict(sorted(all_scores.items(), key=lambda x: x[1], reverse=True))
    }
