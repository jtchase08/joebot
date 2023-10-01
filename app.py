from flask import Flask, request, jsonify, render_template, Response
import requests

app = Flask(__name__)

# Change from 'my_api_key.txt' to 'api_key.txt', and then add your API key to that file.
# I use a separate file for my API when developing so I don't share my API key. :P
with open('my_api_key.txt', 'r') as file: 
    API_KEY = file.read()
OPENAI_API_ENDPOINT = "https://api.openai.com/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

chat_history = []

@app.route('/export_markdown', methods=['GET'])
def export_markdown():
    markdown_content = ""
    
    for message in chat_history:
        if message["role"] == "user":
            markdown_content += f"**User**: {message['content']}\n\n"
        else:
            markdown_content += f"**Assistant**: {message['content']}\n\n"
    
    return Response(markdown_content, mimetype="text/markdown", headers={"Content-disposition": "attachment; filename=chat_history.md"})

@app.route('/clear_server_chat_history', methods=['POST'])
def clear_server_chat_history():
    global chat_history
    chat_history = []
    return jsonify(success=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():

    global chat_history
    data = request.json

    # Append user's message to chat history
    chat_history.append({"role": "user", "content": data['prompt']})

    # Make sure chat_history doesn't get too long (optional and basic implementation)
    while len(chat_history) > 100:  # Keep the last 100 interactions, adjust as needed
        chat_history.pop(0)

    # Build data being sent through the API
    payload = {
        "model": "gpt-3.5-turbo",
        "messages": chat_history
    }

    # Sending the data
    response = requests.post(OPENAI_API_ENDPOINT, headers=headers, json=payload)
    
    # Storing the response
    response_data = response.json()


    # This code checks the API's response for a valid chatbot reply, appends it to the 
    # chat history, and returns it; otherwise, it handles unexpected responses and 
    # returns an error.
    if 'choices' in response_data:
        chatbot_response = response_data['choices'][0]['message']['content'].strip()
        chat_history.append({"role": "assistant", "content": chatbot_response})
        return jsonify(chatbot_response)
    else:
        print("Unexpected response:", response_data)
        return jsonify("An error occurred.")


if __name__ == '__main__':
    app.run(debug=True)
