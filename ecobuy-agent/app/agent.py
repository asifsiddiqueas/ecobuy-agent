import os
import json
import concurrent.futures
from google import genai
from dotenv import load_dotenv

# Load environment variables from a .env file if it exists
load_dotenv()

# Initialize the Gemini client.
# This picks up the GEMINI_API_KEY from your system's environment variables or the .env file.
api_key = os.environ.get("GEMINI_API_KEY")

try:
    if not api_key:
        print("Warning: GEMINI_API_KEY is not set. Using a dummy key for testing.")
        api_key = "DUMMY_KEY_PLEASE_REPLACE"
        
    client = genai.Client(api_key=api_key)
except Exception as e:
    print(f"Error initializing GenAI Client. Details: {e}")
    client = None

def get_gemini_response(prompt):
    """Helper function to make LLM calls to Gemini."""
    if not client:
        return "Error: Gemini client not initialized."
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        return response.text
    except Exception as e:
        return f"Error during Gemini API call: {e}"

def toxicologist_agent(text_input):
    """Agent 1: Checks for toxins using the LLM and the local mock DB as context."""
    try:
        with open('app/mcp_mock.json', 'r') as f:
            hazard_db = f.read()
    except Exception:
        hazard_db = "{}"
    
    prompt = f"""
    You are a Toxicologist Agent. You analyze product descriptions to find harmful chemicals.
    Here is our internal hazard database: {hazard_db}
    
    Analyze the following product input: "{text_input}"
    
    If you find any chemicals in the product that are listed in the database, report them. 
    Format your response as a simple comma-separated list of 'Chemical: Danger level'. 
    If absolutely none are found, say 'None'.
    """
    return {"toxins": get_gemini_response(prompt).strip()}

def greenwash_detector_agent(text_input):
    """Agent 2: Detects greenwashing contradictions using the LLM's reasoning."""
    prompt = f"""
    You are a Greenwash Detector Agent. 
    Analyze the following product input: "{text_input}"
    
    Look for logical contradictions between marketing copy (like '100% Organic', 'Clean', 'Eco-friendly', 'Natural') 
    and the raw chemical realities or synthetic nature of the product.
    
    If you detect greenwashing or contradictory marketing claims, briefly list the claims found and why they are misleading.
    If no greenwashing claims are detected, simply say 'None'.
    """
    return {"greenwash_claims": get_gemini_response(prompt).strip()}

def editor_agent(toxin_data, greenwash_data):
    """Agent 3: Synthesizes data into a final Markdown evaluation grid using the LLM."""
    prompt = f"""
    You are the Editor Agent.
    Your task is to synthesize reports from a Toxicologist and a Greenwash Detector into an immediate, clear Markdown evaluation grid.
    
    Toxicologist Report:
    {toxin_data['toxins']}
    
    Greenwash Detector Report:
    {greenwash_data['greenwash_claims']}
    
    Create a Markdown evaluation grid highlighting toxin alerts, marketing scoreboards, and suggest low-income friendly safe alternatives (e.g. vinegar and baking soda).
    Include a Markdown table with the columns: | Category | Findings | Status |. 
    For 'Status', use emojis like 🚨 DANGER, ⚠️ REVIEW, or ✅ SAFE.
    Keep the output concise, punchy, and ready to be printed to a terminal.
    """
    return get_gemini_response(prompt)

def run_graph(query):
    """Runs the parallel-to-sequential agent graph."""
    if not client:
        return "Cannot run graph without GEMINI_API_KEY."
        
    # Execute Agent 1 and Agent 2 in parallel
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future_tox = executor.submit(toxicologist_agent, query)
        future_green = executor.submit(greenwash_detector_agent, query)
        
        tox_results = future_tox.result()
        green_results = future_green.result()
        
    # Feed their outputs into Agent 3 sequentially
    final_report = editor_agent(tox_results, green_results)
    return final_report

if __name__ == "__main__":
    test_query = "EcoClean, 100% Organic, contains Formaldehyde"
    print(f"--- Evaluating Product: {test_query} ---\n")
    print(run_graph(test_query))
