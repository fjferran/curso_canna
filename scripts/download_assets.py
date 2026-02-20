import json
import os
import sys
import httpx

ARTIFACTS_FILE = "lib/artifacts.json"
PUBLIC_DIR = "public/downloads"

def save_artifacts(data):
    """Guarda artifacts.json. Requiere chmod 666 en el VPS sobre lib/artifacts.json."""
    try:
        with open(ARTIFACTS_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
    except PermissionError:
        print(f"\n  [ERROR] Sin permisos para escribir en {ARTIFACTS_FILE}")
        print(f"  [FIX]   Ejecuta en el VPS:")
        print(f"          chmod 666 /var/www/cannabis-platform/lib/artifacts.json")

def download_assets():
    
    cookie_str = ""
    # Priority 1: Local cookie.txt (Simplest for user)
    if os.path.exists("cookie.txt"):
        try:
            with open("cookie.txt", "r") as f:
                cookie_str = f.read().strip()
                print("  [Auth] Usando cookie desde archivo local 'cookie.txt'")
        except:
            pass

    if not cookie_str:
        # Priority 2: Environment Variable
        cookie_str = os.environ.get("NOTEBOOKLM_COOKIE")
    
    if not cookie_str:
        print("Error: No authentication found. Create 'cookie.txt' in this folder with your cookie.")
        print("Current downloads are likely corrupt (1.3MB placeholders).")
        return

    # Clean corrupt downloads (1.3MB login pages)
    print("  [Cleanup] Revisando descargas corruptas (1.3MB)...")
    for root, dirs, files in os.walk(PUBLIC_DIR):
        for file in files:
            if file.endswith(".mp4") or file.endswith(".mp3"):
                path = os.path.join(root, file)
                if os.path.getsize(path) < 1500000: # Less than 1.5MB is definitely corrupt
                    print(f"    -> Eliminando archivo corrupto: {file}")
                    os.remove(path)

    # Strip quotes if they were added in .env and handle sanity check
    cookie_str = cookie_str.strip('"').strip("'")
    if "SID=" not in cookie_str and "HSID=" not in cookie_str:
        print("Warning: NOTEBOOKLM_COOKIE looks incomplete (Missing SID/HSID).")
        print("If you are on VPS, update .env with the full cookie from Chrome DevTools.")
    
    # Headers exactly matching NotebookLMClient
    cookie_trimmed = cookie_str.strip('\"').strip("'")
    
    # Debug para ver si el cookie está llegando completo
    # print(f"  [Debug] Cookie para descarga: {len(cookie_trimmed)} caracteres.")

    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
        "Referer": "https://notebooklm.google.com/",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "cross-site",
        "Upgrade-Insecure-Requests": "1",
        "Cookie": cookie_trimmed
    }
    
    # print(f"  [Debug] Headers used: {json.dumps({k:v for k,v in headers.items() if k != 'Cookie'}, indent=2)}")
    print(f"  [Debug] Cookie length: {len(cookie_trimmed)}")
    
    # print(f"  [Debug] Headers: {json.dumps(headers, indent=2)}")
    
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
                if url:
                    # Skip if already downloaded
                    if url.startswith("/downloads/"):
                        # print(f"  Skipping local file: {url}")
                        continue

                    # Allow any PDF or Google Doc
                    if not (url.lower().endswith(".pdf") or "google.com" in url or "googleusercontent.com" in url):
                         # If it's not a PDF and not google, maybe skip? 
                         # But sync_notebooks classified it as slide_deck only if .pdf or manual.
                         # Let's be permissive but careful.
                         pass

                    item_id = slide.get("id")
                    if not item_id:
                        continue
                        
                    print(f"  Downloading Slide Deck {i+1}: {slide.get('title')}...")
                    try:
                        filename = f"presentation_{item_id[:8]}.pdf"
                        filepath = os.path.join(subject_dir, filename)
                        
                        # Use httpx stream
                        with http_client.stream("GET", url) as r:
                             # Detectar si nos redirigen al login de Google
                            if "accounts.google.com" in str(r.url) or "text/html" in r.headers.get("content-type", "").lower():
                                if "google.com" in url:
                                    print(f"    -> !!! ERROR DE AUTENTICACIÓN !!!")
                                    print(f"    -> NotebookLM redirigió a la página de login.")
                                    # Don't raise, just skip to avoid stopping everything
                                    print("    -> Skipping due to auth error.")
                                    continue
                            
                            r.raise_for_status()
                            
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
                # Allow YouTube but don't download (keep external)
                if url and ("youtube.com" in url or "youtu.be" in url):
                    print(f"  Skipping download for YouTube video (keeping link): {video.get('title')}")
                    continue

                # Allow direct MP4 downloads from other domains if needed
                if url and (url.lower().endswith(".mp4") or "google.com" in url or "googleusercontent.com" in url):
                    # Skip if already downloaded
                    if url.startswith("/downloads/"):
                        # print(f"  Skipping local video: {url}")
                        continue

                    item_id = video.get("id")
                    if not item_id:
                        continue
                        
                    print(f"  Downloading Video/Audio {i+1}: {video.get('title')}...")
                    try:
                        # Determine extension
                        ext = ".mp4"
                        if video.get('title', '').lower().endswith('.mp3') or url.lower().endswith('.mp3'):
                            ext = ".mp3"
                        elif video.get('title', '').lower().endswith('.wav') or url.lower().endswith('.wav'):
                            ext = ".wav"
                        
                        # Use a more descriptive filename to avoid collisions (especially for premium-video-XXXX)
                        safe_id = item_id.replace("premium-video-", "pv_").replace("-", "_")
                        filename = f"video_{safe_id}{ext}"
                        filepath = os.path.join(subject_dir, filename)
                        
                        with http_client.stream("GET", url) as r:
                             # Detectar si nos redirigen al login de Google
                            if "accounts.google.com" in str(r.url) or "text/html" in r.headers.get("content-type", "").lower():
                                if "google.com" in url:
                                    print(f"    -> !!! ERROR DE AUTENTICACIÓN !!!")
                                    print(f"    -> NotebookLM redirigió a la página de login.")
                                    # Don't raise, just skip to avoid stopping everything
                                    print("    -> Skipping due to auth error.")
                                    continue
                            
                            r.raise_for_status()
                            
                            with open(filepath, 'wb') as f:
                                for chunk in r.iter_bytes(chunk_size=8192):
                                    f.write(chunk)
                        
                        public_path = f"/downloads/{subject_id}/{filename}"
                        data[subject_id]["videos"][i]["content"] = public_path
                        print(f"    -> Saved to {public_path}")
                    except Exception as e:
                        print(f"    -> Error downloading video {i+1}: {e}")

        # Save updates immediately
        save_artifacts(data)

    print("\nDownload complete. Manifest updated.")

if __name__ == "__main__":
    download_assets()
