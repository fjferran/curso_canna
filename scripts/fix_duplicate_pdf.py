import json

ARTIFACTS_FILE = "lib/artifacts.json"

with open(ARTIFACTS_FILE, 'r') as f:
    data = json.load(f)

# Find gm21-1 and remove pdf-ipm-004
if "gm21-1" in data and "slideDecks" in data["gm21-1"]:
    original_len = len(data["gm21-1"]["slideDecks"])
    data["gm21-1"]["slideDecks"] = [
        deck for deck in data["gm21-1"]["slideDecks"]
        if deck.get("id") != "pdf-ipm-004"
    ]
    new_len = len(data["gm21-1"]["slideDecks"])
    print(f"Removed {original_len - new_len} items from gm21-1")

with open(ARTIFACTS_FILE, 'w') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)
    
print("Updated artifacts.json safely.")
