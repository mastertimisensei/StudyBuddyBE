from flask import Flask, render_template, request, redirect, url_for
from flask_login import LoginManager, current_user, login_required
import requests
import firebase_admin
import ML.classification as classification
import ML.checker as checker

app = Flask(__name__)

# Flask-Login login manager
login_manager = LoginManager(app)

# A dictionary to store the user credentials
user = None
@login_manager.user_loader
def load_user(user_id):
    # Load the user from your database
    #loginurl = 'https://studybuddy-backend.onrender.com/signIn' #or 'https://studybuddy-backend.onrender.com/signIn'
    return user_id

@app.route('/')
def index():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    email = request.form['email']
    password = request.form['password']
    loginurl = 'https://studybuddy-backend.onrender.com/signIn'
    # post data to url
    login = requests.post(loginurl, data={'email': email, 'password': password, 'flag':True})
    # check if login is successful
    print(login.status_code)
    if login.status_code == 200:
            url = 'https://studybuddy-backend.onrender.com/getUserData'
            post = requests.post(url, data={'token': login.json()['token']})
            post = post.json()
            global user
            user = email
            if (True):
                print('Login successful!')
                return redirect(url_for('dashboard'))
            else:
                return "Unauthorized Access to Admin Dashboard!"
    else:
        print('Login failed!')
        return render_template('login.html', error='Invalid username or password!')

@login_required
@app.route('/dashboard')
def dashboard():
    #check if the user is logged in
    if user != None:
        print(user)
        count_user_url = 'https://studybuddy-backend.onrender.com/countUsers' #or 'localhost:3000/countUsers'
        get_user_url = 'https://studybuddy-backend.onrender.com/getAllUsersData' #or 'localhost:3000/getUsers'
        # get data from url
        count_user = requests.get(count_user_url)
        get_user = requests.get(get_user_url)
        # convert to json
        count_user = count_user.json()
        count_user = count_user['users']
        get_user = get_user.json()
        # render the template
        return render_template('dashboard.html', count_user=count_user, users=get_user)
    else:
        return "Unauthorized Access to Admin Dashboard!"

@login_required
@app.route('/getUserdata/<string:uid>')
def getUserdata(uid):
    #check if the user is logged in
    if user != None:
        get_user_url = 'https://studybuddy-backend.onrender.com/getAdminUserData'
        post = requests.post(get_user_url, data={'uid': uid})

        if post.status_code != 200:
            return f"Error fetching user data: {post.status_code}"
        try:
            data = post.json()
            # get buddy names based on buddy ids
            for i in range(len(data['buddies'])):
                buddy = data['buddies'][i]
                buddy_url = 'https://studybuddy-backend.onrender.com/getAdminUserData'
                buddy_post = requests.post(buddy_url, data={'uid': buddy})
                if buddy_post.status_code != 200:
                    return f"Error fetching user data: {buddy_post.status_code}"
                buddy_data = buddy_post.json()
                data['buddies'][i] = buddy_data
        except ValueError as e:
            return f"Error parsing response as JSON: {e}"
        #show the user profile picture for that user
        showProfilePicurl = 'https://studybuddy-backend.onrender.com/showProfilePicture'
        showProfilePic = requests.post(showProfilePicurl, data={'uid': uid})
        pic = None
        if showProfilePic.status_code != 200:
            print("No profile picture found")
        else:
            print ("Profile picture found")
            pic = showProfilePic.json()
        return render_template('user.html', user=data, pic=pic[0])
    else:
        return "Unauthorized Access to Admin Dashboard!"

@app.route('/showRecommendationScore', methods=['POST'])
def show_recommendation_score():
    data = request.get_json()
    uid = data['uid']
    buddy_uid = data['buddy_uid']
    #get user data from getAdminUserData endpoint
    get_user_url = 'https://studybuddy-backend.onrender.com/getAdminUserData'
    post1 = requests.post(get_user_url, data={'uid': uid})
    post2 = requests.post(get_user_url, data={'uid': buddy_uid})
    if post1.status_code != 200:
        return f"Error fetching user data: {post1.status_code}"
    if post2.status_code != 200:
        return f"Error fetching user data: {post2.status_code}"
    try:
        data1 = post1.json()
        #print(data1)
        data2 = post2.json()
        #print(data2)
        # generate the prompt
        prompt = checker.generate_prompt(data1, data2)
        print(prompt)
        # get the score
        response = checker.get_response(prompt)
        return response

    except ValueError as e:
        return f"Error parsing response as JSON: {e}"

@app.route('/showRecommendationPage', methods=['GET'])
def show_recommendation_page():
    user = request.args.get('user_uid')
    buddy = request.args.get('buddy_uid')
    get_user_url = 'https://studybuddy-backend.onrender.com/getAdminUserData'
    post1 = requests.post(get_user_url, data={'uid':user})
    post2 = requests.post(get_user_url, data={'uid': buddy})
    if post1.status_code != 200:
        return f"Error fetching user data: {post1.status_code}"
    if post2.status_code != 200:
        return f"Error fetching user data: {post2.status_code}"
    data1 = post1.json()
    data2 = post2.json()
    prompt = checker.generate_prompt(data1, data2)
    response = checker.get_response(prompt)
    print(response)
    response = response.split("Recommendation Score: ")[0]
    try:
        #the response is a json object
        data = eval(response)
        print(data)
        return render_template('recommendation.html', recommendation=data)
    except ValueError as e:
        return f"Error parsing response as JSON: {e}"
    
    
#log out the user
@app.route('/logout')
def logout():
    global user
    user = None
    return redirect(url_for('login'))



if __name__ == '__main__':
    app.run(debug=True)