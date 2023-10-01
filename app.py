from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

with open('api_key.txt', 'r') as file: # Add your API key to api_key.txt
    API_KEY = file.read()
OPENAI_API_ENDPOINT = "https://api.openai.com/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": data['prompt']}]
    }
    response = requests.post(OPENAI_API_ENDPOINT, headers=headers, json=payload)
    response_data = response.json()

    if 'choices' in response_data:
        return jsonify(response_data['choices'][0]['message']['content'].strip())
    else:
        # Print or log the unexpected response for debugging purposes
        print("Unexpected response:", response_data)
        return jsonify("An error occurred.")

if __name__ == '__main__':
    app.run(debug=True)
