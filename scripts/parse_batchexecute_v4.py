import json
import re

def parse_batchexecute(filepath):
    with open(filepath, 'r') as f:
        raw = f.read()
    
    # 1. Skip the first line usually `)]}'`
    # 2. Inspect lines. The file usually has a length prefix line, then the array.
    # In our debug_api_response_v4.json, line 3 is the length `786221`, line 4 is the data.
    
    lines = raw.split('\n')
    data_line = None
    for line in lines:
        if line.strip().startswith('[['):
            data_line = line
            break
            
    if not data_line:
        print("Could not find JSON array line.")
        return

    try:
        data = json.loads(data_line)
    except json.JSONDecodeError as e:
        print(f"Failed to parse JSON: {e}")
        return

    # data structure: [["wrb.fr", "wXbhsf", "[...INNER_JSON_STRING...]", ...]]
    # We need to parse that inner string.
    
    inner_json_str = None
    if data and isinstance(data, list) and len(data) > 0:
        item = data[0]
        if len(item) > 2:
            inner_json_str = item[2]
            
    if not inner_json_str:
        print("Could not find inner JSON string.")
        return

    try:
        inner_data = json.loads(inner_json_str)
    except Exception as e:
        print(f"Failed to parse inner JSON: {e}")
        return

    # Debug structure
    print(f"Inner Data Type: {type(inner_data)}")
    if isinstance(inner_data, list):
        print(f"Inner Data Length: {len(inner_data)}")
        if len(inner_data) > 0:
            print(f"First Item Type: {type(inner_data[0])}")
            # Check for extra nesting
            if isinstance(inner_data[0], list) and len(inner_data[0]) > 0 and isinstance(inner_data[0][0], list):
                 print("Detected extra nesting layer. Unwrapping...")
                 inner_data = inner_data[0]

    # Now inspect inner_data. 
    # Based on view_file: [[["RICARDO SUAY", ...], ...]]
    # It seems to be a list of notebooks.
    
    notebooks = []
    
    # The structure seems to be: [ [Notebook1], [Notebook2], ... ]
    # Let's try to iterate.
    if isinstance(inner_data, list):
        for index, item in enumerate(inner_data):
            if not isinstance(item, list) or len(item) < 2:
                print(f"Skipping item {index}: Not a list or too short")
                continue
                
            # Heuristic extraction
            # item[0] seems to be Title? e.g. "RICARDO SUAY"
            # item[1] seems to be Source List?
            # item[2] seems to be Notebook ID? e.g. "4d698458..."
            
            title = item[0]
            sources_raw = item[1]
            try:
                notebook_id = item[2]
            except IndexError:
                notebook_id = "MISSING_ID"
            
            print(f"Inspecting Item {index}: Title='{title}', ID='{notebook_id}'")

            # Additional check if it's really a notebook entry
            if not (isinstance(title, str) and isinstance(notebook_id, str) and len(notebook_id) > 10):
                print(f"  -> Skipping: Criteria not met")
                continue
                
            notebook_entry = {
                "id": notebook_id,
                "title": title,
                "sources": []
            }
            
            if isinstance(sources_raw, list):
                for source in sources_raw:
                    # source structure: [["UUID"], "Filename/Title", [params?], [params?], type_int?, url_list?, ...]
                    
                    if not isinstance(source, list) or len(source) < 2:
                        continue
                        
                    s_id = source[0][0] if (isinstance(source[0], list) and source[0]) else "unknown"
                    s_title = source[1]
                    
                    s_url = None
                    s_type = "unknown"
                    s_drive_id = None
                    s_secondary_id = None
                    
                    # Inspect the metadata list (index 2)
                    if len(source) > 2 and isinstance(source[2], list):
                        metadata_list = source[2]
                        if len(metadata_list) > 0 and isinstance(metadata_list[0], list) and len(metadata_list[0]) > 0:
                            possible_drive_id = metadata_list[0][0]
                            if isinstance(possible_drive_id, str) and len(possible_drive_id) > 20:
                                s_drive_id = possible_drive_id
                                s_url = f"https://docs.google.com/document/d/{s_drive_id}"
                        
                        # Look for secondary UUID (index 3 of metadata_list?)
                        # Structure seen: [None, 4278, [TS], ['UUID2', ...], ...]
                        if len(metadata_list) > 3 and isinstance(metadata_list[3], list) and len(metadata_list[3]) > 0:
                             possible_sec_id = metadata_list[3][0]
                             if isinstance(possible_sec_id, str) and len(possible_sec_id) > 20:
                                 s_secondary_id = possible_sec_id

                    # Scan for explicit URLs (Web/YouTube)
                    if not s_url:
                        for elem in source:
                            if isinstance(elem, str) and (elem.startswith("http") or "googleusercontent" in elem):
                                s_url = elem
                                break
                            if isinstance(elem, list):
                                for sub_elem in elem:
                                    if isinstance(sub_elem, str) and (sub_elem.startswith("http") or "googleusercontent" in sub_elem):
                                        s_url = sub_elem
                                        break
                            if s_url: break
                    
                    if s_title.lower().endswith(".pdf"):
                        s_type = "pdf"
                    elif s_title.lower().endswith(".mp3") or s_title.lower().endswith(".wav"):
                        s_type = "audio"
                    elif s_url and ("youtube" in s_url or "youtu.be" in s_url):
                        s_type = "youtube"
                    elif s_url:
                        s_type = "web"
                    
                    if not s_url:
                        print(f"DEBUG RAW SOURCE (No URL found): Type={s_type}, ID={s_id}, SecID={s_secondary_id}")

                    notebook_entry["sources"].append({
                        "id": s_id,
                        "title": s_title,
                        "type": s_type,
                        "url": s_url,
                        "secondary_id": s_secondary_id
                    })
                        
                    if "Configurar Zigbee2MQTT en DOCKER" in s_title:
                        print(f"DEBUG RAW SOURCE DATA for '{s_title}':")
                        print(json.dumps(source, indent=2))
                        
                    notebook_entry["sources"].append({
                        "id": s_id,
                        "title": s_title,
                        "type": s_type,
                        "url": s_url
                    })
            
            notebooks.append(notebook_entry)

    # Print results
    print(f"Found {len(notebooks)} notebooks.")
    for nb in notebooks:
        print(f"Notebook: {nb['title']} ({nb['id']})")
        for s in nb['sources']:
            print(f"  - [{s['type']}] {s['title']} ({s['url']})")
        print("-" * 20)

if __name__ == "__main__":
    parse_batchexecute("debug_api_response_v4.json")
