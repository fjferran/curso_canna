
import requests
import sys
# Add scripts dir to path to import sync_notebooks
sys.path.append('.')
from scripts.sync_notebooks import get_cookie

COOKIE = get_cookie()
HEADERS = {
    "Cookie": COOKIE,
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

NOTEBOOK_ID = "4d698458-ff63-464b-801e-babd89738652"
PDF_SEC_ID = "2fef2166-a771-4b8a-ab4c-e65cf85f0a5b"
AUDIO_SEC_ID = "571d60e7-bb57-4c8e-88ab-3021472a8967"

URLS_TO_TEST = [
    f"https://notebooklm.googleusercontent.com/media/{PDF_SEC_ID}",
    f"https://notebooklm.google.com/media/{PDF_SEC_ID}",
    f"https://notebooklm.google.com/notebook/{NOTEBOOK_ID}/media/{PDF_SEC_ID}",
    f"https://notebooklm.googleusercontent.com/notebook/{NOTEBOOK_ID}/media/{PDF_SEC_ID}",
    # Audio likely uses a different endpoint?
    f"https://notebooklm.googleusercontent.com/media/{AUDIO_SEC_ID}",
]

print(f"Testing {len(URLS_TO_TEST)} URLs...")

for url in URLS_TO_TEST:
    print(f"Testing: {url}")
    try:
        # Use GET instead of HEAD to see content
        resp = requests.get(url, headers=HEADERS, allow_redirects=True, stream=True)
        print(f"  Status: {resp.status_code}")
        print(f"  Content-Type: {resp.headers.get('content-type')}")
        print(f"  Content-Length: {resp.headers.get('content-length')}")
        
        # Read first 100 bytes
        chunk = next(resp.iter_content(chunk_size=100))
        print(f"  Start of content: {chunk}")
        
        if resp.status_code == 200:
            print("  SUCCESS (Maybe?)")
    except Exception as e:
        print(f"  Error: {e}")
