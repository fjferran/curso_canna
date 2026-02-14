
import json
import os

FILE_PATH = "lib/artifacts.json"

def migrate():
    if not os.path.exists(FILE_PATH):
        print(f"Error: {FILE_PATH} not found.")
        return

    with open(FILE_PATH, 'r') as f:
        data = json.load(f)

    new_data = {}
    for subject_id, content in data.items():
        new_subject = content.copy()
        
        # Migrate slideDeck to slideDecks
        if "slideDeck" in content:
            new_subject["slideDecks"] = [content["slideDeck"]]
            del new_subject["slideDeck"]
        elif "slideDecks" not in new_subject:
             new_subject["slideDecks"] = []

        # Migrate video to videos
        if "video" in content:
            new_subject["videos"] = [content["video"]]
            del new_subject["video"]
        elif "videos" not in new_subject:
             new_subject["videos"] = []
             
        new_data[subject_id] = new_subject

    with open(FILE_PATH, 'w') as f:
        json.dump(new_data, f, indent=4, ensure_ascii=False)
    
    print(f"Migration complete for {len(new_data)} subjects.")

if __name__ == "__main__":
    migrate()
