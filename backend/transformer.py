import json
import numpy as np
from sentence_transformers import SentenceTransformer

DATASET_FILE = "FIR_dataset_1000.json"
EMBEDDING_FILE = "dataset_with_embeddings.json"
MODEL_NAME = "all-MiniLM-L6-v2"

model = SentenceTransformer(MODEL_NAME)

def load_dataset():
    with open(DATASET_FILE, 'r') as f:
        return json.load(f)

def save_dataset(dataset):
    with open(EMBEDDING_FILE, 'w') as f:
        json.dump(dataset, f)
    print("Saved dataset with embeddings.")

def generate_embeddings(dataset):
    for item in dataset:
        print(f"Generating embedding for FIR ID {item['FIR_ID']}...")
        embedding = model.encode(item['Incident_Description']).tolist()
        item['embedding'] = embedding
    save_dataset(dataset)

def cosine_similarity(vec1, vec2):
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

def find_best_match(input_text, dataset):
    input_embedding = model.encode(input_text)
    best_match = None
    highest_similarity = -1

    for item in dataset:
        if 'embedding' not in item:
            continue
        similarity = cosine_similarity(np.array(input_embedding), np.array(item['embedding']))
        if similarity > highest_similarity:
            highest_similarity = similarity
            best_match = item

    return best_match, highest_similarity

def main():
    dataset = load_dataset()
    try:
        with open(EMBEDDING_FILE, 'r') as f:
            dataset = json.load(f)
        print("Loaded dataset with embeddings.")
    except FileNotFoundError:
        print("Embedding file not found. Generating embeddings...")
        generate_embeddings(dataset)

    input_text = input("Enter the description of the case: ")
    match, similarity = find_best_match(input_text, dataset)

    if match:
        print("\nBest Match Found:")
        print(f"FIR ID: {match['FIR_ID']}")
        print(f"Description: {match['Incident_Description']}")
        print(f"IPC Section: {match['IPC_Sections']}")
        print(f"Similarity Score: {similarity:.4f}")
    else:
        print("No match found.")

if __name__ == "__main__":
    main()
