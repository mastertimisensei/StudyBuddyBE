from flask import Flask, render_template, request, redirect, url_for
from flask_login import LoginManager, current_user, login_required
import requests
import firebase_admin

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
    #loginurl = 'http://localhost:3000/signIn' #or 'https://studybuddy-backend.onrender.com/signIn'
    return user_id

@app.route('/')
def index():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    loginurl = 'http://localhost:3000/signIn' #or 'https://studybuddy-backend.onrender.com/signIn'
    # post data to url
    login = requests.post(loginurl, data={'email': username, 'password': password})
    # check if login is successful
    if login.status_code == 200:
        print('Login successful!')
        return redirect(url_for('dashboard'))
    else:
        print('Login failed!')
        return render_template('login.html', error='Invalid username or password!')

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
    # render the template
    return render_template('dashboard.html', count_user=count_user, users=get_user)

@login_required
@app.route('/getUserdata/<string:uid>')
def getUserdata(uid):
    get_user_url = 'http://localhost:3000/getUserData'
    post = requests.post(get_user_url, data={'uid': uid})

    if post.status_code != 200:
        return f"Error fetching user data: {post.status_code}"
    try:
        data = post.json()
    except ValueError as e:
        return f"Error parsing response as JSON: {e}"
    print(data)
    #show the user profile picture for that user
    showProfilePicurl = 'http://localhost:3000/showProfilePicture'
    showProfilePic = requests.post(showProfilePicurl, data={'uid': uid})
    pic = None
    if showProfilePic.status_code != 200:
        print("No profile picture found")
    else:
        print ("Profile picture found")
        pic = showProfilePic.json()
    return render_template('user.html', user=data, pic=pic[0])





if __name__ == '__main__':
    app.run(debug=True)