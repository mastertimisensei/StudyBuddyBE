import re
import string
import math

def clean_text(text):
    #Removes punctuation and converts text to lowercase.
    text = text.translate(str.maketrans('', '', string.punctuation))
    text = text.lower()
    return text

def get_word_frequency(text):
    #Returns a dictionary of word frequencies for the given text.
    words = re.findall(r'\b\w+\b', text)
    word_freq = {}
    for word in words:
        if word in word_freq:
            word_freq[word] += 1
        else:
            word_freq[word] = 1
    return word_freq

def get_cosine_similarity(bio1, bio2):
    #Calculates the cosine similarity between two texts.

    text1 = clean_text(bio1)
    text2 = clean_text(bio2)
    
    word_freq1 = get_word_frequency(text1)
    word_freq2 = get_word_frequency(text2)
    
    words = set(list(word_freq1.keys()) + list(word_freq2.keys()))
    
    dot_product = 0
    mag1 = 0
    mag2 = 0
    
    for word in words:
        dot_product += word_freq1.get(word, 0) * word_freq2.get(word, 0)
        mag1 += word_freq1.get(word, 0) ** 2
        mag2 += word_freq2.get(word, 0) ** 2
    
    try:
        similarity = dot_product / (math.sqrt(mag1) * math.sqrt(mag2))
    except ZeroDivisionError:
        similarity = 0.0
    
    return similarity