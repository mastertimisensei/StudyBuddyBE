import openai
import classification


# Set up the model and prompt
model_engine = "gpt-3.5-turbo"
instruction = """
Give a study recommendation score (between 1 - 10) for these two to studying together. 
The higher the score, the more likely they are to be a good match for studying together. Dont only consider their cosine similarity, but also their location and universities.
"""


system_msg = """
You are a data scientist. You are working on a project that requires you to analyze the data between users and their study habits.
""" + instruction


prompt = """
Give a study recommendation score (between 1 - 10) for these two to studying together. The higher the score, the more likely they are to be a good match for studying together. 
Consider all the information you have about them.
Subjects similarity is the most important factor. Location is the second most important factor. Major is the third most important factor.

Person 1
Location: Budapest
Major: Business
University: ELTE
Subjects: Mathematics, Object Oriented Programming, Algorithms

Person 2
Location:  Budapest
Major: Fashion Design
University: Moholy-Nagy University of Art and Design
Subjects: Fashion Design, Art History, Fashion Marketing

Cosine similarity : 10 (out of 100)

Generate your response in a json format, only give me the score.
"{
    score:<<score>>
    }"
"""


response = openai.ChatCompletion.create(model="gpt-3.5-turbo",
                                        messages=[{"role": "system", "content": system_msg},
                                         {"role": "user", "content": prompt}])

response = response.choices[0]["message"]["content"]
print(response)
