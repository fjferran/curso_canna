import json
import os
import urllib.parse
import unicodedata

ARTIFACTS_FILE = "lib/artifacts.json"

def normalize_str(s):
    return unicodedata.normalize('NFKD', s).encode('ASCII', 'ignore').decode('utf-8').lower()

with open(ARTIFACTS_FILE, 'r') as f:
    data = json.load(f)

for subject_id in ["gm21-1", "gm21-2", "gm21-3", "gm21-4"]:
    if subject_id in data and "slideDecks" in data[subject_id]:
        downloads_dir = os.path.join("public", "downloads", subject_id)
        if not os.path.exists(downloads_dir): continue
        files = os.listdir(downloads_dir)
        
        for deck in data[subject_id]["slideDecks"]:
            content_url = deck.get("content", "")
            if "contribution.usercontent.google.com/download" in content_url:
                parsed_url = urllib.parse.urlparse(content_url)
                params = urllib.parse.parse_qs(parsed_url.query)
                if "filename" in params:
                    fname = params["filename"][0]
                    norm_fname = normalize_str(fname)
                    
                    found = False
                    for local_f in files:
                        norm_local_f = normalize_str(local_f)
                        if norm_local_f == norm_fname:
                            # Use Next.js path from public root
                            deck["content"] = f"/downloads/{subject_id}/{local_f}"
                            print(f"Updated {subject_id} '{deck.get('title')}' to {local_f}")
                            found = True
                            break
                    if not found:
                        print(f"⚠️ No local file found for '{fname}' in {subject_id}")

with open(ARTIFACTS_FILE, 'w') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)
    
print("All done.")
