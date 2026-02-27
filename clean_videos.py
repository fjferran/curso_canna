import json

with open("lib/artifacts.json", "r") as f:
    data = json.load(f)

for subject_id, content in data.items():
    if "videos" in content:
        # User has no real videos, all current videos are mock.
        # Wipe them all to prevent fetch_media trying to download them.
        content["videos"] = []

with open("lib/artifacts.json", "w") as f:
    json.dump(data, f, indent=4, ensure_ascii=False)
