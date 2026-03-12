from dotenv import load_dotenv
import os

load_dotenv()

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import numpy as np
from sentence_transformers import SentenceTransformer
import requests
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Configuration
EMBEDDING_FILE = "dataset_with_embeddings.json"
MODEL_NAME = "all-MiniLM-L6-v2"
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
DEEPSEEK_MODEL = 'deepseek/deepseek-chat'  # DeepSeek v3 model

# Load models
print("Loading sentence transformer model...")
sentence_model = SentenceTransformer(MODEL_NAME)
print("Model loaded successfully!")

# Load dataset with embeddings
print("Loading dataset with embeddings...")
try:
    with open(EMBEDDING_FILE, 'r', encoding='utf-8') as f:
        dataset = json.load(f)
    print(f"Dataset loaded successfully! Total records: {len(dataset)}")
except FileNotFoundError:
    print("ERROR: dataset_with_embeddings.json not found!")
    dataset = []

# Configure OpenRouter API
if OPENROUTER_API_KEY:
    print("OpenRouter API configured successfully with DeepSeek model!")
else:
    print("WARNING: OPENROUTER_API_KEY not set. General chat will not work.")


def cosine_similarity(vec1, vec2):
    """Calculate cosine similarity between two vectors"""
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))


def find_best_ipc_match(input_text):
    """Find the best matching IPC section for the given complaint"""
    if not dataset:
        return None, 0.0
    
    input_embedding = sentence_model.encode(input_text)
    best_match = None
    highest_similarity = -1

    for item in dataset:
        if 'embedding' not in item:
            continue
        similarity = cosine_similarity(
            np.array(input_embedding), 
            np.array(item['embedding'])
        )
        if similarity > highest_similarity:
            highest_similarity = similarity
            best_match = item

    return best_match, highest_similarity


@app.route('/api/ipc-finder', methods=['POST'])
def ipc_finder():
    """Endpoint to find relevant IPC section for a complaint"""
    try:
        data = request.get_json()
        complaint_text = data.get('complaint', '').strip()
        
        if not complaint_text:
            return jsonify({
                'success': False,
                'error': 'Complaint text is required'
            }), 400
        
        # Find best match
        match, similarity = find_best_ipc_match(complaint_text)
        
        if match and similarity > 0.3:  # Threshold for relevance
            response = {
                'success': True,
                # 'ipc_section': match.get('IPC_Sections', 'Not found'),
                'ipc_section': match.get('BNS_Sections', 'Not found').replace("IPC", "BNS"),
                'description': match.get('Incident_Description', ''),
                'fir_id': match.get('FIR_ID', ''),
                'similarity_score': float(similarity),
                # 'message': f"Based on your complaint, the relevant IPC section is: {match.get('IPC_Sections', 'Not found')}"
                'message': f"Based on your complaint, the relevant BNS section is: {match.get('BNS_Sections', 'Not found').replace('IPC','BNS')}"
            }
        else:
            response = {
                'success': True,
                'ipc_section': 'No match found',
                'message': 'Could not find a relevant IPC section for your complaint. Please provide more details or consult with a legal expert.',
                'similarity_score': float(similarity) if match else 0.0
            }
        
        return jsonify(response), 200
        
    except Exception as e:
        print(f"Error in ipc_finder: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/general-chat', methods=['POST'])
def general_chat():
    """Endpoint for general chat using OpenRouter DeepSeek API"""
    try:
        if not OPENROUTER_API_KEY:
            return jsonify({
                'success': False,
                'error': 'OpenRouter API is not configured.'
            }), 500
        
        data = request.get_json()
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return jsonify({
                'success': False,
                'error': 'Message is required'
            }), 400
        
        # Generate response using OpenRouter DeepSeek
        headers = {
            'Authorization': f'Bearer {OPENROUTER_API_KEY}',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:5173',  # Optional
            'X-Title': 'YURUS IPC Mapper',  # Optional
        }
        
        payload = {
            'model': DEEPSEEK_MODEL,
            'messages': [
                {
                    'role': 'system',
                    # 'content': 'You are a helpful legal assistant for the YURUS IPC Mapper application. Provide clear and accurate information about Indian Penal Code sections and legal matters. Avoid using markdown formatting like ** or ##. Use plain text only with proper paragraphs.'
                    'content': 'You are a helpful legal assistant for the YURUS legal chatbot. The Indian Penal Code has been replaced by the Bharatiya Nyaya Sanhita (BNS). Always explain legal matters using BNS sections instead of IPC sections. Provide clear explanations. Avoid markdown formatting and respond in plain text.'
                },
                {
                    'role': 'user',
                    'content': user_message
                }
            ]
        }
        
        response = requests.post(OPENROUTER_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        
        result = response.json()
        assistant_message = result['choices'][0]['message']['content']
        
        return jsonify({
            'success': True,
            'message': assistant_message
        }), 200
        
    except requests.exceptions.RequestException as e:
        print(f"Error in general_chat (API request): {str(e)}")
        return jsonify({
            'success': False,
            'error': f'API request failed: {str(e)}'
        }), 500
    except Exception as e:
        print(f"Error in general_chat: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/ipc-sections', methods=['GET'])
def get_ipc_sections():
    """Endpoint to get all IPC sections from CSV"""
    try:
        import csv
        ipc_sections = []
        
        with open('ipc_sections.csv', 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                ipc_sections.append({
                    'section': row.get('Section', ''),
                    'offense': row.get('Offense', ''),
                    'punishment': row.get('Punishment', ''),
                    'description': row.get('Description', '')
                })
        
        return jsonify({
            'success': True,
            'data': ipc_sections,
            'total': len(ipc_sections)
        }), 200
        
    except Exception as e:
        print(f"Error in get_ipc_sections: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'dataset_loaded': len(dataset) > 0,
        'openrouter_configured': OPENROUTER_API_KEY is not None,
        'model': DEEPSEEK_MODEL
    }), 200


if __name__ == '__main__':
    print("\n" + "="*50)
    print("YURUS IPC Mapper Backend Server")
    print("="*50)
    print(f"Dataset records: {len(dataset)}")
    print(f"OpenRouter API: {'Configured' if OPENROUTER_API_KEY else 'Not configured'}")
    print(f"Model: {DEEPSEEK_MODEL}")
    print("="*50 + "\n")
    app.run(debug=True, host='0.0.0.0', port=5000)
