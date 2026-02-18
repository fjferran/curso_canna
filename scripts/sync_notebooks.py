import json
import os
import sys
import subprocess
import shlex

ARTIFACTS_FILE = "lib/artifacts.json"

class CurlResponse:
    def __init__(self, text, status_code=200):
        self.text = text
        self.status_code = status_code
        self.url = "https://notebooklm.google.com" # Placeholder
        self.headers = {"content-type": "application/json"}

    def json(self):
        return json.loads(self.text)

def get_cookie():
    try:
        if os.path.exists("cookie.txt"):
            with open("cookie.txt", "r") as f:
                return f.read().strip()
    except Exception as e:
        print(f"Error reading cookie.txt: {e}")
    return None

def curl_get(url):
    cookie_str = get_cookie()
    if not cookie_str:
        print("Error: No authentication found.")
        sys.exit(1)
    
    print(f"DEBUG: Using cookie starting with: {cookie_str[:50]}...")
        
    target_url = "https://notebooklm.google.com/_/LabsTailwindUi/data/batchexecute?rpcids=wXbhsf&source-path=%2Fnotebook%2F10b81259-110c-4609-a04d-8ea6ce9af080&bl=boq_labs-tailwind-frontend_20260216.02_p0&f.sid=-1088580930230069560&hl=es&_reqid=100669&rt=c"
    
    # RPC payload updated with new 'at' token
    payload = "f.req=%5B%5B%5B%22wXbhsf%22%2C%22%5Bnull%2C1%2Cnull%2C%5B2%5D%5D%22%2Cnull%2C%22generic%22%5D%5D%5D&at=AE_H9gbxBFeYHljRK5cdQp2TI5P5%3A1771369868711&"
    
    headers = [
        "-H 'accept: */*'",
        "-H 'accept-language: es-ES,es;q=0.9'",
        "-H 'content-type: application/x-www-form-urlencoded;charset=UTF-8'",
        "-H 'origin: https://notebooklm.google.com'",
        "-H 'priority: u=1, i'",
        "-H 'referer: https://notebooklm.google.com/'",
        "-H 'sec-ch-ua: \"Google Chrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"'",
        "-H 'sec-ch-ua-arch: \"arm\"'",
        "-H 'sec-ch-ua-bitness: \"64\"'",
        "-H 'sec-ch-ua-form-factors: \"Desktop\"'",
        "-H 'sec-ch-ua-full-version: \"143.0.7499.193\"'",
        "-H 'sec-ch-ua-full-version-list: \"Google Chrome\";v=\"143.0.7499.193\", \"Chromium\";v=\"143.0.7499.193\", \"Not A(Brand\";v=\"24.0.0.0\"'",
        "-H 'sec-ch-ua-mobile: ?0'",
        "-H 'sec-ch-ua-model: \"\"'",
        "-H 'sec-ch-ua-platform: \"macOS\"'",
        "-H 'sec-ch-ua-platform-version: \"15.7.1\"'",
        "-H 'sec-ch-ua-wow64: ?0'",
        "-H 'sec-fetch-dest: empty'",
        "-H 'sec-fetch-mode: cors'",
        "-H 'sec-fetch-site: same-origin'",
        "-H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36'",
        "-H 'x-browser-channel: stable'",
        "-H 'x-browser-copyright: Copyright 2026 Google LLC. All Rights reserved.'",
        "-H 'x-browser-validation: AUXUCdutEJ+6gl6bYtz7E2kgIT4='",
        "-H 'x-browser-year: 2026'",
        "-H 'x-client-data: CIq2yQEIprbJAQipncoBCJz8ygEIlqHLAQiGoM0BCJaMzwEIjaDPAQi1os8BCNSjzwEIk6TPAQiapc8BCOilzwEY7IXPARiyhs8BGMKhzwE='",
        "-H 'x-same-domain: 1'",
    ]
    header_str = " ".join(headers)
    
    script_content = f"""#!/bin/sh
curl '{target_url}' \\
  -v -s --compressed -X POST \\
  {header_str} \\
  -b '{cookie_str}' \\
  --data-raw '{payload}'
"""
    
    with open("temp_curl_exec.sh", "w") as f:
        f.write(script_content)
    os.chmod("temp_curl_exec.sh", 0o755)
    
    try:
        result = subprocess.run(["./temp_curl_exec.sh"], capture_output=True, text=True, check=True)
        return CurlResponse(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"Curl execution failed: {e}")
        return CurlResponse(e.stderr if e.stderr else "Failed", 500)

def sync():
    # Execute the request
    print("Fetching notebooks...")
    # NOTE: We are using a hardcoded RPC call that seems to return ALL notebooks (ListNotebooks).
    response = curl_get("placeholder")
    
    if response.status_code != 200:
        print(f"Error fetching data: {response.status_code}")
        return

    # Parse batchexecute response
    resp_text = response.text
    
    # Parse batchexecute response
    resp_text = response.text
    with open("debug_live_response.json", "w") as f:
        f.write(resp_text)
    print("DEBUG: Saved raw response to debug_live_response.json")
    
    def extract_data_line(text):
        if not text: return None
        for line in text.split('\n'):
            if line.strip().startswith('[['):
                return line
        return None

    data_line = extract_data_line(resp_text)
    data = None
    inner_json_str = None

    # Try to parse the data_line from curl
    if data_line:
        try:
            temp_data = json.loads(data_line)
            if temp_data and isinstance(temp_data, list) and len(temp_data) > 0:
                item = temp_data[0]
                if len(item) > 2 and item[2]:
                    data = temp_data
                    inner_json_str = item[2]
        except json.JSONDecodeError:
            print("Warning: Failed to parse JSON from curl response.")
    
    # If invalid or missing, try fallback
    if not inner_json_str:
        print("Warning: API response invalid or empty. Attempting to fallback to local file 'debug_api_response_v4.json'...")
        if os.path.exists("debug_api_response_v4.json"):
            try:
                with open("debug_api_response_v4.json", "r") as f:
                    file_text = f.read()
                
                # Check for length prefixed format
                data_line = extract_data_line(file_text)
                if data_line:
                    try:
                        temp_data = json.loads(data_line)
                        if temp_data and isinstance(temp_data, list) and len(temp_data) > 0:
                            item = temp_data[0]
                            if len(item) > 2 and item[2]:
                                data = temp_data
                                inner_json_str = item[2]
                                print("Fallback successful.")
                    except json.JSONDecodeError:
                        print("Error: Failed to parse JSON from fallback file.")
            except Exception as e:
                print(f"Fallback failed: {e}")

    if not inner_json_str:
        print("Fatal Error: Could not find valid inner JSON string in API response or local fallback.")
        return

    try:
        inner_data = json.loads(inner_json_str)
    except Exception as e:
        print(f"Error: Failed to parse inner JSON: {e}")
        return

    if isinstance(inner_data, list) and len(inner_data) > 0:
        if isinstance(inner_data[0], list) and len(inner_data[0]) > 0 and isinstance(inner_data[0][0], list):
             print("DEBUG: Detected extra nesting layer. Unwrapping...")
             inner_data = inner_data[0]

    # --- Load Notebook ID Mapping from lib/data.ts ---
    id_map = {}
    try:
        with open("lib/data.ts", "r") as f:
            data_ts_content = f.read()
            # Regex to find id and notebookUrl pairs
            # matches: id: "gm21-1", ... notebookUrl: ".../notebook/UUID"
            # We look for blocks. This is a simple regex, might need refinement if file format varies.
            # Assuming standard formatting as seen in file view.
            
            # Strategy: Find all subject blocks, extract ID and NotebookURL
            # Look for id: "..." then eventually notebookUrl: "..."
            
            # Simple line-by-line parsing might be safer given the structure
            current_id = None
            for line in data_ts_content.split('\n'):
                line = line.strip()
                if line.startswith('id: "'):
                    current_id = line.split('"')[1]
                elif line.startswith('notebookUrl: "') and current_id:
                    url = line.split('"')[1]
                    if "/notebook/" in url:
                        nb_uuid = url.split("/notebook/")[1]
                        id_map[nb_uuid] = current_id
                    # Reset current_id only if we found a url? No, strictly strictly sequential
                    # But module IDs also have 'id: "..."'. 
                    # Module IDs look like "gm21", subject IDs "gm21-1".
                    # We only care about ones with notebookUrls.
    except Exception as e:
        print(f"Error parsing lib/data.ts: {e}")
        return

    print(f"Loaded {len(id_map)} notebook mappings from lib/data.ts")

    # Final artifacts dictionary (keyed by subjectId)
    artifacts_store = {}

    if isinstance(inner_data, list):
        for index, item in enumerate(inner_data):
            if not isinstance(item, list) or len(item) < 2:
                continue
                
            title = item[0]
            sources_raw = item[1]
            try:
                notebook_id = item[2]
            except IndexError:
                notebook_id = "MISSING_ID"
            
            if not (isinstance(title, str) and isinstance(notebook_id, str) and len(notebook_id) > 10):
                continue

            # Check if this notebook is relevant (in our map or supplemental map)
            supplemental_map = {
                "4d698458-ff63-464b-801e-babd89738652": "gm21-2", # RICARDO SUAY -> Cultivo en Interior
            }
            
            subject_id = None
            if notebook_id in id_map:
                subject_id = id_map[notebook_id]
            elif notebook_id in supplemental_map:
                subject_id = supplemental_map[notebook_id]
                print(f"DEBUG: Mapping orphan notebook via supplemental map: {title} ({notebook_id}) -> {subject_id}")
            
            if not subject_id:
                # print(f"Skipping unmapped notebook: {title} ({notebook_id})")
                continue
            
            print(f"Processing notebook: {title} -> {subject_id}")

            # Initialize subject artifact structure (append to existing if multiple notebooks)
            if subject_id not in artifacts_store:
                artifacts_store[subject_id] = {
                    "subjectId": subject_id,
                    "notebookId": notebook_id, # Stores the first encountered
                    "title": title,
                    "slideDecks": [],
                    "videos": [],
                    "sources": [],
                    "studyGuide": {"id": f"guide-{notebook_id}", "title": "Guía de Estudio", "status": "completed", "type": "report", "content": f"Guía generada para {title}"},
                    "table": {"id": f"table-{notebook_id}", "title": "Datos Clave", "status": "completed", "type": "data_table", "content": "Tabla de datos"}
                }
            
            subject_entry = artifacts_store[subject_id]
            
            if isinstance(sources_raw, list):
                for source in sources_raw:
                    if not isinstance(source, list) or len(source) < 2:
                        continue
                        
                    s_id = source[0][0] if (isinstance(source[0], list) and source[0]) else "unknown"
                    s_title = source[1]
                    
                    s_url = None
                    s_type = "unknown"
                    s_drive_id = None
                    s_secondary_id = None
                    
                    if len(source) > 2 and isinstance(source[2], list):
                        metadata_list = source[2]
                        if len(metadata_list) > 0 and isinstance(metadata_list[0], list) and len(metadata_list[0]) > 0:
                            possible_drive_id = metadata_list[0][0]
                            if isinstance(possible_drive_id, str) and len(possible_drive_id) > 20:
                                s_drive_id = possible_drive_id
                                s_url = f"https://docs.google.com/document/d/{s_drive_id}"
                        
                        if len(metadata_list) > 3 and isinstance(metadata_list[3], list) and len(metadata_list[3]) > 0:
                             possible_sec_id = metadata_list[3][0]
                             if isinstance(possible_sec_id, str) and len(possible_sec_id) > 20:
                                 s_secondary_id = possible_sec_id

                    # Helper to recursively find URL
                    def find_url(obj, depth=0):
                        if depth > 5: return None
                        if isinstance(obj, str) and (obj.startswith("http") or "googleusercontent" in obj):
                            return obj
                        if isinstance(obj, list):
                            for item in obj:
                                res = find_url(item, depth + 1)
                                if res: return res
                        return None

                    if not s_url:
                        s_url = find_url(source)
                    
                    if s_type == "unknown":
                        is_pdf = s_title.lower().endswith(".pdf") or "(pdf)" in s_title.lower() or "[pdf]" in s_title.lower()
                        s_low = s_title.lower()
                        
                        if is_pdf:
                            # Strict filtering for Slide Decks
                            keywords = ["presentación", "tema", "módulo", "clase", "diapositivas", "slides", "ppt"]
                            # Also include specific known valid ones like "GM21-1" or "GM20-..."
                            if any(k in s_low for k in keywords) or "gm" in s_low or "fundamentos" in s_low:
                                s_type = "pdf"
                            else:
                                s_type = "web" # Treat as generic source
                        elif s_low.endswith(".mp3") or s_low.endswith(".wav"):
                            s_type = "audio"
                        elif s_url and ("youtube" in s_url or "youtu.be" in s_url):
                            s_type = "youtube"
                        elif s_url and (s_url.lower().endswith(".mp4") or s_title.lower().endswith(".mp4")):
                            s_type = "video_file"
                        elif s_url:
                            s_type = "web"
                    
                    # Store in appropriate category
                    if s_type == "pdf":
                        subject_entry["slideDecks"].append({
                            "id": s_id,
                            "title": s_title,
                            "type": "slide_deck",
                            "content": s_url,
                            "status": "completed"
                        })
                    elif s_type == "youtube":
                        subject_entry["videos"].append({
                            "id": s_id,
                            "title": s_title,
                            "type": "video",
                            "content": s_url,
                            "status": "completed"
                        })
                    elif s_type == "audio":
                         # Treat audio (Audio Overviews) as videos for now so they appear in media section
                        subject_entry["videos"].append({
                            "id": s_id,
                            "title": s_title, # e.g. "Audio Overview.wav"
                            "type": "audio",
                            "content": s_url,
                            "status": "completed"
                        })
                    elif s_type == "video_file":
                        subject_entry["videos"].append({
                            "id": s_id,
                            "title": s_title,
                            "type": "video",
                            "content": s_url,
                            "status": "completed"
                        })
                    elif s_type == "web":
                         # Source interface: title, author, description (url)
                        subject_entry["sources"].append({
                            "title": s_title,
                            "author": "Web Source",
                            "description": s_url or ""
                        })
                    # Audio now included as videos for UI compatibility

            artifacts_store[subject_id] = subject_entry
    
    print(f"Mapped {len(artifacts_store)} subjects.")
    
    with open(ARTIFACTS_FILE, 'w') as f:
        json.dump(artifacts_store, f, indent=2, ensure_ascii=False)
        
    print(f"Updated {ARTIFACTS_FILE}")

if __name__ == "__main__":
    sync()
