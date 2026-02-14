
import json
import os
import sys
import time
from notebooklm_mcp.api_client import NotebookLMClient
from notebooklm_mcp.auth import load_cached_tokens

# Path to artifacts.json
ARTIFACTS_FILE = "lib/artifacts.json"

def get_client():
    cached = load_cached_tokens()
    if not cached:
        print("Error: No cached tokens found. Please run 'notebooklm-mcp-auth' first.")
        sys.exit(1)
        
    return NotebookLMClient(
        cookies=cached.cookies,
        csrf_token=cached.csrf_token,
        session_id=cached.session_id
    )

def sync_sources():
    if not os.path.exists(ARTIFACTS_FILE):
        print(f"Error: {ARTIFACTS_FILE} not found.")
        return

    try:
        with open(ARTIFACTS_FILE, 'r') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading artifacts.json: {e}")
        return


    client = get_client()
    print("NotebookLM Client initialized.")

    total_added = 0
    total_skipped = 0
    total_failed = 0
    
    # Iterate through all subjects
    for subject_id, content in data.items():
        notebook_id = content.get("notebookId")
        if not notebook_id:
            continue
            
        sources = content.get("sources", [])
        if not sources:
            continue
            
        print(f"\nProcessing {subject_id} (Notebook ID: {notebook_id})")
        
        # Fetch existing sources to avoid duplicates
        try:
            print("  Fetching existing sources...")
            existing_sources = client.get_notebook_sources_with_types(notebook_id)
            existing_urls = set()
            for s in existing_sources:
                if s.get("url"):
                    existing_urls.add(s["url"])
            print(f"  Found {len(existing_sources)} existing sources.")
        except Exception as e:
            print(f"  Error fetching sources: {e}")
            existing_urls = set()

        
        for i, source in enumerate(sources):
            url = source.get("description") # URL is in description field
            title = source.get("title")
            
            if not url or not url.startswith("http"):
                continue

            # Check if already exists
            if url in existing_urls:
                print(f"  [{i+1}/{len(sources)}] Skipping (already exists): {title[:40]}...")
                total_skipped += 1
                continue
                
            print(f"  [{i+1}/{len(sources)}] Adding: {title[:50]}...")
            
            try:
                result = client.add_url_source(notebook_id, url)
                if result:
                    print(f"    -> Success: {result.get('title', 'Unknown')}")
                    total_added += 1
                    # Add to set so we don't try to add it again if duplicate in list
                    existing_urls.add(url)
                else:
                    print(f"    -> Failed (None returned)")
                    total_failed += 1
                
                # Increased sleep to avoid rate limits
                time.sleep(3) 
                
            except Exception as e:
                print(f"    -> Error: {e}")
                total_failed += 1
                time.sleep(5) # Wait longer on error

    print("\n------------------------------------------------")
    print(f"Sync Complete.")
    print(f"Total Added: {total_added}")
    print(f"Total Skipped: {total_skipped}")
    print(f"Total Failed: {total_failed}")

if __name__ == "__main__":
    sync_sources()
