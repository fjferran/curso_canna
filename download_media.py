
import json
import os
import sys
import requests
from notebooklm_mcp.auth import load_cached_tokens

ARTIFACTS_FILE = "lib/artifacts.json"
PUBLIC_DIR = "public/downloads"

def download_media():
    cached = load_cached_tokens()
    if not cached:
        print("Error: No cached tokens found.")
        sys.exit(1)
    
    # Session cookies are needed to download the private files
    cookies = cached.cookies
    
    if not os.path.exists(ARTIFACTS_FILE):
        print(f"Error: {ARTIFACTS_FILE} not found.")
        return

    with open(ARTIFACTS_FILE, 'r') as f:
        data = json.load(f)

    for subject_id, content in data.items():
        # Create folder for subject: public/downloads/gm21-1/
        subject_dir = os.path.join(PUBLIC_DIR, subject_id)
        os.makedirs(subject_dir, exist_ok=True)
        print(f"\nProcessing {subject_id}...")

        # 1. Download Video
        if "video" in content and content["video"].get("content"):
            url = content["video"]["content"]
            # Only download if it's a google link (not already local)
            if "googleusercontent.com" in url:
                print("  Downloading Video...")
                try:
                    # Construct local filename
                    filename = "video_overview.mp4"
                    filepath = os.path.join(subject_dir, filename)
                    
                    # Download with auth cookies
                    with requests.get(url, cookies=cookies, stream=True) as r:
                        r.raise_for_status()
                        with open(filepath, 'wb') as f:
                            for chunk in r.iter_content(chunk_size=8192):
                                f.write(chunk)
                    
                    # Update JSON with local public path
                    # Path accessible via web browser: /downloads/gm21-1/video_overview.mp4
                    public_path = f"/downloads/{subject_id}/{filename}"
                    data[subject_id]["video"]["content"] = public_path
                    print(f"    -> Saved to {public_path}")
                except Exception as e:
                    print(f"    -> Error downloading video: {e}")

        # 2. Download Slide Deck
        if "slideDeck" in content and content["slideDeck"].get("content"):
            url = content["slideDeck"]["content"]
            if "google.com" in url:
                print("  Downloading Slide Deck...")
                try:
                    filename = "presentation.pdf"
                    filepath = os.path.join(subject_dir, filename)
                    
                    with requests.get(url, cookies=cookies, stream=True) as r:
                         r.raise_for_status()
                         with open(filepath, 'wb') as f:
                            for chunk in r.iter_content(chunk_size=8192):
                                f.write(chunk)

                    public_path = f"/downloads/{subject_id}/{filename}"
                    data[subject_id]["slideDeck"]["content"] = public_path
                    print(f"    -> Saved to {public_path}")
                except Exception as e:
                    print(f"    -> Error downloading slides: {e}")

        # Save artifact updates immediately
        with open(ARTIFACTS_FILE, 'w') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

    print("\nDownload complete. Artifacts updated with local paths.")

if __name__ == "__main__":
    download_media()
