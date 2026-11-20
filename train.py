from naive_bayes import NaiveBayesClassifier

data_texts = [
    # Billing
    "I was charged twice for my subscription",
    "My invoice shows wrong amount",
    "I need a refund for my last payment",
    "Why was my credit card charged extra?",
    "I want to cancel my subscription and get refund",
    "Billing error on my account please fix",
    "I didn't authorize this payment",
    "My payment failed but money was deducted",
    "Please send me my invoice for this month",
    "I need to update my payment method",
    # Technical Support
    "The app keeps crashing on my phone",
    "I cannot login to my account",
    "Website is not loading properly",
    "Error 404 when I try to access my dashboard",
    "My password reset link is not working",
    "The software is running very slow",
    "I am getting an error message on screen",
    "App is not syncing with my device",
    "Cannot upload files to the platform",
    "The feature is broken and not working",
    # Account Management
    "I want to change my email address",
    "How do I update my profile information?",
    "I want to delete my account permanently",
    "Can I change my username?",
    "I need to reset my password",
    "How do I add a new user to my account?",
    "I want to upgrade my plan",
    "Please merge my two accounts",
    "I am locked out of my account",
    "How do I change my account settings?",
    # Shipping & Delivery
    "My order has not arrived yet",
    "I received a damaged product",
    "Wrong item was delivered to me",
    "Where is my package? It is late",
    "I want to track my shipment",
    "My delivery address is wrong please update",
    "The courier did not deliver my order",
    "I want to return the product I received",
    "My order was marked delivered but I got nothing",
    "Can I change my delivery address?",
    # General Inquiry
    "What are your working hours?",
    "Do you offer student discounts?",
    "How does your service work?",
    "What is your refund policy?",
    "Do you have a mobile app?",
    "How can I contact customer support?",
    "What plans do you offer?",
    "Is my data safe with you?",
    "Do you support multiple languages?",
    "How do I get started with your service?",
]

data_labels = (
    ["Billing"] * 10 +
    ["Technical Support"] * 10 +
    ["Account Management"] * 10 +
    ["Shipping & Delivery"] * 10 +
    ["General Inquiry"] * 10
)

model = NaiveBayesClassifier()
model.fit(data_texts, data_labels)
model.save("model/classifier.json")

# Quick accuracy check
correct = sum(1 for t, l in zip(data_texts, data_labels) if model.predict([t])[0] == l)
print(f"Training Accuracy: {correct}/{len(data_texts)} = {correct/len(data_texts)*100:.1f}%")
print("Model saved to model/classifier.json")
