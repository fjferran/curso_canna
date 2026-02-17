import json

# Read the raw response file
with open("debug_api_response.json", "r") as f:
    raw_content = f.read()

# The response starts with )]}' which needs to be stripped
if raw_content.startswith(")]}'"):
    raw_content = raw_content[4:].strip()

# Parse batchexecute format: length\nJSON
lines = raw_content.split('\n')
parsed_successfully = False

for line in lines:
    line = line.strip()
    if not line: continue
    
    # Try to parse lines that look like arrays
    if line.startswith('['):
        try:
            data = json.loads(line)
            parsed_successfully = True
            
            print(f"Parsed JSON line starting with: {line[:50]}...")
            
            # Save formatted main JSON
            with open("debug_structure_pretty.json", "w") as f:
                json.dump(data, f, indent=2)
                
            # data is typically [["wrb.fr", "rpcId", "INNER_JSON_STRING", ...], ...]
            # Let's interact with the first item which usually has the payload
            if isinstance(data, list) and len(data) > 0:
                first_item = data[0]
                if isinstance(first_item, list) and len(first_item) > 2:
                    payload_str = first_item[2]
                    if isinstance(payload_str, str):
                        try:
                            inner_data = json.loads(payload_str)
                            with open("debug_inner_pretty.json", "w") as f:
                                json.dump(inner_data, f, indent=2)
                            print("Successfully extracted and dumped INNER JSON payload.")
                        except json.JSONDecodeError:
                            print("Inner payload string exists but is not valid JSON.")
            break
        except json.JSONDecodeError:
            continue

if not parsed_successfully:
    print("Could not find valid JSON array line in response.")
