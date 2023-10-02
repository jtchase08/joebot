# joebot

A simple client-side chatbot using any OpenAI model you want.

This is intended to be built on top of and developed further as you see fit. At least for now.

### Features

* Uses GPT-3.5-Turbo, but can be changed to any other model OpenAI offers
* Has a simple day/night mode toggle
* Trash can clears chat history
* Save icon saves your visible chat history as a Markdown (.md) file

### Screenshot(s)

![image of sample convo](https://files.catbox.moe/tltdqr.png)

### How to use

1. Clone repo or download as zip
2. Update **line 9** in *app.py* to read *api_key.txt* instead of *my_api_key.txt*
3. Paste your API key generated from [here](https://platform.openai.com/account/api-keys), in *api_key.txt*, save and close file.
4. Install dependencies
    - Flask with *pip install Flask*
    - jsonify with *pip install jsonify*
4. Run app.py
5. Navigate to **http://127.0.0.1:5000** in your browser