import json
import os
import sys
import httpx

ARTIFACTS_FILE = "lib/artifacts.json"
PUBLIC_DIR = "public/downloads"

def download_assets():
    # Try to load cookie from environment variable (VPS method)
    cookie_str = os.environ.get("NOTEBOOKLM_COOKIE")
    
    # Fallback to local auth if env var is missing (Development method)
    if not cookie_str:
        try:
            from notebooklm_mcp.auth import load_cached_tokens
            cached = load_cached_tokens()
            if cached and cached.cookies:
                cookie_str = "; ".join(f"{k}={v}" for k, v in cached.cookies.items())
        except ImportError:
            print("Warning: collaborative notebooklm-mcp library not found. Set NOTEBOOKLM_COOKIE env var.")
            pass

    if not cookie_str:
        print("Error: No authentication found. Set NOTEBOOKLM_COOKIE environment variable.")
        sys.exit(1)
    
    # Headers exactly matching NotebookLMClient
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://notebooklm.google.com/",
        "Origin": "https://notebooklm.google.com",
        "X-Same-Domain": "1",
        "Cookie": cookie_str
    }
    
    # Rename to http_client to avoid confusion
    http_client = httpx.Client(headers=headers, follow_redirects=True, timeout=60.0)

    if not os.path.exists(ARTIFACTS_FILE):
        print(f"Error: {ARTIFACTS_FILE} not found.")
        return

    with open(ARTIFACTS_FILE, 'r') as f:
        data = json.load(f)

    for subject_id, content in data.items():
        subject_dir = os.path.join(PUBLIC_DIR, subject_id)
        os.makedirs(subject_dir, exist_ok=True)
        print(f"\nProcessing {subject_id}...")

        # 1. Download Slide Decks
        if "slideDecks" in content:
            for i, slide in enumerate(content["slideDecks"]):
                url = slide.get("content")
                if url and ("google.com" in url or "googleusercontent.com" in url):
                    item_id = slide.get("id")
                    if not item_id:
                        continue
                        
                    print(f"  Downloading Slide Deck {i+1}: {slide.get('title')}...")
                    try:
                        filename = f"presentation_{item_id[:8]}.pdf"
                        filepath = os.path.join(subject_dir, filename)
                        
                        # Use httpx stream
                        with http_client.stream("GET", url) as r:
                            # If error, print details
                            if r.status_code != 200:
                                print(f"    -> Error {r.status_code}: {r.extensions.get('reason_phrase', 'Unknown')}")
                                try:
                                    # Read a bit of the response
                                    content_peek = r.read()[:200]
                                    print(f"    -> Body Peek: {content_peek}")
                                except: pass
                            
                            r.raise_for_status()
                            
                            if "text/html" in r.headers.get("content-type", "").lower():
                                content_peek = r.read()[:200]
                                print(f"    -> HTML Content Peak: {content_peek}")
                                raise ValueError("Auth Failed: Received HTML page. Run notebooklm-mcp-auth.")
                            
                            with open(filepath, 'wb') as f:
                                for chunk in r.iter_bytes(chunk_size=8192):
                                    f.write(chunk)
                        
                        public_path = f"/downloads/{subject_id}/{filename}"
                        data[subject_id]["slideDecks"][i]["content"] = public_path
                        print(f"    -> Saved to {public_path}")
                    except Exception as e:
                        print(f"    -> Error downloading slide {i+1}: {e}")

        # 2. Download Videos
        if "videos" in content:
            for i, video in enumerate(content["videos"]):
                url = video.get("content")
                if url and ("google.com" in url or "googleusercontent.com" in url):
                    item_id = video.get("id")
                    if not item_id:
                        continue
                        
                    print(f"  Downloading Video {i+1}: {video.get('title')}...")
                    try:
                        filename = f"video_{item_id[:8]}.mp4"
                        filepath = os.path.join(subject_dir, filename)
                        
                        with http_client.stream("GET", url) as r:
                             # If error, print details
                            if r.status_code != 200:
                                print(f"    -> Error {r.status_code}: {r.extensions.get('reason_phrase', 'Unknown')}")
                                try:
                                    content_peek = r.read()[:200]
                                    print(f"    -> Body Peek: {content_peek}")
                                except: pass

                            r.raise_for_status()

                            if "text/html" in r.headers.get("content-type", "").lower():
                                content_peek = r.read()[:200]
                                print(f"    -> HTML Content Peak: {content_peek}")
                                raise ValueError("Auth Failed: Received HTML page. Run notebooklm-mcp-auth.")
                            
                            with open(filepath, 'wb') as f:
                                for chunk in r.iter_bytes(chunk_size=8192):
                                    f.write(chunk)
                        
                        public_path = f"/downloads/{subject_id}/{filename}"
                        data[subject_id]["videos"][i]["content"] = public_path
                        print(f"    -> Saved to {public_path}")
                    except Exception as e:
                        print(f"    -> Error downloading video {i+1}: {e}")

        # Save updates immediately
        with open(ARTIFACTS_FILE, 'w') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

    print("\nDownload complete. Manifest updated.")

if __name__ == "__main__":
    download_assets()
