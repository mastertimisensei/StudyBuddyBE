import json
import openai
import ML.classification as classification
import hidden_key
# Set up the model and prompt
model_engine = "gpt-3.5-turbo"

openai.api_key = hidden_key.hidden_key
# dont forget to set your openai api key

def json_to_string(json_obj):
    #pop out all except location, major, university, subjects from json_obj
    keys_to_keep = ["location", "major", "university", "subjects"]
    json_obj = {key: value for key, value in json_obj.items() if key in keys_to_keep}
    # Convert JSON object to string
    json_str = json.dumps(json_obj, indent=4)
    # Remove brackets
    json_str = json_str[1:-1]
    # Replace commas with new lines
    json_str = json_str.replace(',', '\n')
    print(json_str)
    return json_str

def generate_prompt(json_obj1,json_obj2):
    instruction = """
    Give a study recommendation score (between 1 - 10) for these two to studying together. 
    The higher the score, the more likely they are to be a good match for studying together. Dont only consider their cosine similarity, but also their location and universities.
    """
    other_considerations = "Subjects similarity is the most important factor. Location is the second most important factor. Major is the third most important factor."
    json_str1 = json_to_string(json_obj1)
    #print(json_str1)
    json_str2 = json_to_string(json_obj2)
    #print(json_str2)
    bio = json_obj1["bio"]
    print(bio)
    cosine_similarity = classification.get_cosine_similarity(json_obj1["bio"], json_obj2["bio"])
    prompt = "" + instruction + "\n" + other_considerations + "\n\nPerson 1\n" + json_str1 + "\n\nPerson 2\n" + json_str2 + "\n\nCosine similarity : "+ str(cosine_similarity) + "\n\nGenerate your response in this json format.\n\"{\n    \"score\":<<score>>, \"reason\": \"<<reason>>\"\n    }\""
    return prompt

def get_response(prompt):
    instruction = """
    Give a study recommendation score (between 1 - 10) for these two to studying together. 
    The higher the score, the more likely they are to be a good match for studying together. Dont only consider their cosine similarity, but also their location and universities.
    """
    system_msg = """
    You are a data scientist. You are working on a project that requires you to analyze the data between users and their study habits.
    """ + instruction

    response = openai.ChatCompletion.create(model=model_engine,
                                            messages=[{"role": "system", "content": system_msg},
                                            {"role": "user", "content": prompt}])
    response = response.choices[0]["message"]["content"]
    return response


#example prompt

