import json

ARTIFACTS_FILE = "lib/artifacts.json"

with open(ARTIFACTS_FILE, 'r') as f:
    data = json.load(f)

if "gm21-2" in data and "slideDecks" in data["gm21-2"]:
    for deck in data["gm21-2"]["slideDecks"]:
        if "Technical Cannabis IPM" in deck.get("title", ""):
            deck["content"] = "/downloads/gm21-2/Technical_Cannabis_IPM.pdf"
            print("Updated content to local path.")

with open(ARTIFACTS_FILE, 'w') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)
    
print("Updated artifacts.json safely.")
