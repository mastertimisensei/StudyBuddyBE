from flask import Flask, render_template, request, redirect, url_for
from flask_login import LoginManager, current_user, login_required
import requests

app = Flask(__name__)

# Flask-Login login manager
login_manager = LoginManager(app)

# A dictionary to store the user credentials
users = {
    'user1': 'password1',
    'user2': 'password2',
    'user3': 'password3'
}

@login_manager.user_loader
def load_user(user_id):
    # Load the user from your database
    return user_id

@app.route('/')
def index():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']

    if username in users and users[username] == password:
        return redirect(url_for('dashboard'))
    else:
        error = 'Invalid username or password. Please try again.'
        return render_template('login.html', error=error)

@login_required
@app.route('/dashboard')
def dashboard():
    count_user_url = 'http://localhost:3000/countUsers' #or 'https://studybuddy-backend.onrender.com/countUsers'
    get_user_url = 'http://localhost:3000/getAllUsersData' #or 'https://studybuddy-backend.onrender.com/getUsers'
    # get data from url
    count_user = requests.get(count_user_url)
    get_user = requests.get(get_user_url)
    # convert to json
    count_user = count_user.json()
    count_user = count_user['users']
    get_user = get_user.json()
    print(get_user)
    # render the template
    return render_template('dashboard.html', count_user=count_user, users=get_user)



if __name__ == '__main__':
    app.run(debug=True)