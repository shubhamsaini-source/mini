# 🎫 TicketAI — Customer Support Ticket Classifier
### MCA 3rd Semester Mini Project

---

## 📌 Project Kya Hai?

TicketAI ek **AI-powered web application** hai jo customer support tickets ko automatically classify karta hai. Matlab agar koi customer koi complaint ya query likhta hai, toh ye system khud samajh leta hai ki ye ticket **kis category** mein aati hai — bina kisi insaan ke manually padhne ke.

**Example:**
> Customer likhta hai: *"Mujhe do baar charge ho gaya subscription ka"*
> TicketAI automatically classify karega: ✅ **Billing** (High Priority)

---

## 🎯 Problem Jo Solve Ho Rahi Hai

Badi companies ko rozana **hazaron support tickets** milte hain. Inhe manually padhna aur sahi department ko bhejne mein bahut time lagta hai. TicketAI ye kaam **seconds mein** kar deta hai — automatically, accurately, aur bina kisi human effort ke.

---

## 🏷️ 5 Categories Mein Classify Karta Hai

| Category | Matlab | Priority | Response Time |
|---|---|---|---|
| 💳 Billing | Payment, invoice, refund se related | 🔴 High | 2-4 hours |
| 🔧 Technical Support | App crash, login issue, bug | 🔴 High | 1-3 hours |
| 👤 Account Management | Password reset, profile update | 🟡 Medium | 4-8 hours |
| 📦 Shipping & Delivery | Order tracking, delivery issue | 🟡 Medium | 4-6 hours |
| 💬 General Inquiry | General questions, policies | 🟢 Low | 24 hours |

---

## 🧠 AI/ML Kaise Kaam Karta Hai? (Step by Step)

```
User Input Text
      ↓
  Tokenization
(text ko words mein todna, stop words hatana)
      ↓
  Bigram Creation
(do words ke pairs banana — better context ke liye)
      ↓
  Naive Bayes Classifier
(probability calculate karta hai har category ki)
      ↓
  Softmax
(probabilities ko 0-100% mein convert karna)
      ↓
  Result + Confidence Score
```

### 🔬 Algorithm: Naive Bayes

- **Naive Bayes** ek probabilistic ML algorithm hai
- Ye calculate karta hai: *"Is text ke words dekh ke, kaunsi category most likely hai?"*
- Jaise doctor symptoms dekh ke disease diagnose karta hai — waise ye words dekh ke category predict karta hai
- **TF-IDF** (Term Frequency - Inverse Document Frequency) se words ko weight diya jaata hai — common words kam important, rare words zyada important

### 📊 Training Data

Model ko **50 example tickets** pe train kiya gaya hai:
- 10 Billing examples
- 10 Technical Support examples
- 10 Account Management examples
- 10 Shipping & Delivery examples
- 10 General Inquiry examples

Training accuracy: **100%** (kyunki custom Naive Bayes scratch se banaya hai)

---

## 💻 Tech Stack (Kya Kya Use Kiya)

| Technology | Kaam | Kyun Use Kiya |
|---|---|---|
| 🐍 **Python** | Core language | Simple, powerful, ML ke liye best |
| 🌐 **Flask** | Web server/backend | Lightweight Python web framework |
| 🤖 **Naive Bayes** | ML Algorithm | Fast, accurate, text classification ke liye ideal |
| 📐 **TF-IDF** | Feature extraction | Words ko numbers mein convert karna |
| 🎨 **HTML/CSS/JS** | Frontend UI | Interactive web interface |
| 📄 **JSON** | Data storage | History aur model save karna |

> ⭐ **Koi external ML library nahi use ki** — Naive Bayes algorithm **scratch se Python mein likha** hai (`naive_bayes.py`). Ye project ki sabse badi achievement hai.

---

## 📁 Project Structure (Kaunsi File Kya Karti Hai)

```
TicketAI_Project/
│
├── app.py              → Flask web server, saare routes handle karta hai
├── classifier.py       → ML prediction logic, categories ka metadata
├── naive_bayes.py      → 🌟 Custom Naive Bayes algorithm (scratch se likha)
├── train.py            → Model ko training data pe train karta hai
│
├── templates/          → HTML pages (Flask yahan se serve karta hai)
│   ├── index.html      → Main classifier page
│   ├── history.html    → Purane tickets ki history
│   ├── analytics.html  → Charts aur statistics
│   └── about.html      → Project ke baare mein
│
├── static/             → CSS, JavaScript files
│   ├── style.css       → Poora UI design (dark theme, animations)
│   ├── main.js         → Classify page ka logic
│   ├── bg.js           → Animated neural network background
│   ├── history.js      → History page ka logic
│   └── analytics.js    → Analytics charts ka logic
│
├── model/
│   └── classifier.json → Trained model (train.py chalane ke baad banta hai)
│
├── history.json        → Classified tickets ki history (auto-generate)
├── requirements.txt    → Python dependencies
└── START.bat           → One-click launcher (Windows)
```

---

## ✨ Features

- 🎯 **Real-time Classification** — ticket type karo, instantly result milta hai
- 📊 **Confidence Score** — model kitna sure hai (percentage mein)
- 📋 **History** — saare classified tickets save rehte hain
- 📈 **Analytics** — charts dikhate hain kaunsi category zyada aayi
- 🎨 **Animated UI** — dark theme, neural network background, smooth animations
- ⌨️ **Ctrl+Enter** shortcut — keyboard se classify karo
- 🔍 **Filter** — history mein category ke hisaab se filter karo

---

## 🚀 Kaise Chalayein

### Method 1: One Click (Recommended)
```
START.bat pe double-click karo
```
Ye automatically:
1. Flask install karega
2. Model train karega (pehli baar)
3. Browser mein open kar dega

### Method 2: Manual
```bash
# Step 1: Dependencies install karo
pip install flask

# Step 2: Model train karo
python train.py

# Step 3: App chalao
python app.py

# Step 4: Browser mein kholo
http://127.0.0.1:5000
```

---

## 🖥️ Screenshots / Pages

| Page | URL | Kya Dikhta Hai |
|---|---|---|
| 🔍 Classifier | `/` | Ticket enter karo, result dekho |
| 📋 History | `/history` | Saare past tickets |
| 📊 Analytics | `/analytics` | Category/priority charts |
| ℹ️ About | `/about` | Project explanation |

---

## 👨‍💻 Banaya Kisne

**MCA 3rd Semester Mini Project**
- Algorithm: Custom Naive Bayes (scratch se)
- UI: Dark theme with animated neural network background
- Backend: Python + Flask
- No external ML libraries used ✅

---

*"Ye project dikhata hai ki Machine Learning sirf libraries import karne se nahi hoti — asli samajh tab aati hai jab algorithm khud likhte hain."* 🎓
