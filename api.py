from flask import Flask, jsonify
from firebase_admin import credentials, firestore, initialize_app,auth

# Initialize Flask app
app = Flask(__name__)

# Initialize Firebase credentials
cred = credentials.Certificate("study-buddy-backend-de08a-firebase-adminsdk-gjxpe-95f5652e5d.json")
firebase_app = initialize_app(cred)
db = firestore.client()

# Route to print all users in Firebase database
@app.route('/users', methods=['GET'])
def get_users():
    try:
        # Get all users
        all_users = auth.list_users().iterate_all()
        users = [{'uid': user.uid, 'email': user.email} for user in all_users]
        return jsonify({'users': users}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to get user data from Firebase

@app.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        # Fetch user data from Firebase database
        user_ref = db.collection('users').document(user_id)
        user_data = user_ref.get().to_dict()
        if user_data:
            return jsonify({'user_id': user_id, 'user_data': user_data}), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Route to create random users and add random user data to Firebase
@app.route('/users', methods=['POST'])
def create_user():
    try:
        # Create user in Firebase authentication
        user = auth.create_user()
        # Create user data in Firebase database
        user_ref = db.collection('users').document(user.uid)

if __name__ == '__main__':
    app.run(debug=True)

