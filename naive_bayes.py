import math
import re
import json
import os
from collections import defaultdict

STOP_WORDS = {
    "i","me","my","we","our","you","your","he","she","it","they","them",
    "is","are","was","were","be","been","being","have","has","had","do",
    "does","did","will","would","could","should","may","might","shall",
    "a","an","the","and","or","but","in","on","at","to","for","of","with",
    "this","that","these","those","am","not","no","so","if","as","by","from",
    "up","about","into","than","then","there","when","where","who","how",
    "what","which","can","just","also","very","more","get","got","need"
}

def tokenize(text):
    text = text.lower()
    tokens = re.findall(r'\b[a-z]{2,}\b', text)
    tokens = [t for t in tokens if t not in STOP_WORDS]
    bigrams = [tokens[i]+"_"+tokens[i+1] for i in range(len(tokens)-1)]
    return tokens + bigrams

class NaiveBayesClassifier:
    def fit(self, texts, labels):
        self.classes_ = list(set(labels))
        self.class_counts = defaultdict(int)
        self.word_counts = defaultdict(lambda: defaultdict(int))
        self.vocab = set()

        for text, label in zip(texts, labels):
            self.class_counts[label] += 1
            for token in tokenize(text):
                self.word_counts[label][token] += 1
                self.vocab.add(token)

        self.total = sum(self.class_counts.values())
        self.word_totals = {c: sum(self.word_counts[c].values()) for c in self.classes_}
        return self

    def predict_proba(self, texts):
        results = []
        for text in texts:
            tokens = tokenize(text)
            scores = {}
            for c in self.classes_:
                log_prob = math.log(self.class_counts[c] / self.total)
                vocab_size = len(self.vocab)
                for token in tokens:
                    count = self.word_counts[c].get(token, 0)
                    log_prob += math.log((count + 1) / (self.word_totals[c] + vocab_size))
                scores[c] = log_prob

            # Softmax to get probabilities
            max_score = max(scores.values())
            exp_scores = {c: math.exp(s - max_score) for c, s in scores.items()}
            total_exp = sum(exp_scores.values())
            probs = [exp_scores[c] / total_exp for c in self.classes_]
            results.append(probs)
        return results

    def predict(self, texts):
        proba = self.predict_proba(texts)
        return [self.classes_[p.index(max(p))] for p in proba]

    def save(self, path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        data = {
            "classes_": self.classes_,
            "class_counts": dict(self.class_counts),
            "word_counts": {c: dict(self.word_counts[c]) for c in self.classes_},
            "vocab": list(self.vocab),
            "total": self.total,
            "word_totals": self.word_totals
        }
        with open(path, "w") as f:
            json.dump(data, f)

    @classmethod
    def load(cls, path):
        with open(path) as f:
            data = json.load(f)
        model = cls()
        model.classes_ = data["classes_"]
        model.class_counts = defaultdict(int, data["class_counts"])
        model.word_counts = defaultdict(lambda: defaultdict(int))
        for c, wc in data["word_counts"].items():
            model.word_counts[c] = defaultdict(int, wc)
        model.vocab = set(data["vocab"])
        model.total = data["total"]
        model.word_totals = data["word_totals"]
        return model
