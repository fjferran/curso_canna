
import json
import os
import sys
from notebooklm_mcp.api_client import NotebookLMClient
from notebooklm_mcp.auth import load_cached_tokens

ARTIFACTS_FILE = "lib/artifacts.json"

def get_client():
    cached = load_cached_tokens()
    if not cached:
        print("Error: No cached tokens found. Run 'notebooklm-mcp-auth' first.")
        sys.exit(1)
    return NotebookLMClient(cookies=cached.cookies, csrf_token=cached.csrf_token, session_id=cached.session_id)

def sync():
    if not os.path.exists(ARTIFACTS_FILE):
        print(f"Error: {ARTIFACTS_FILE} not found.")
        return

    client = get_client()
    print("NotebookLM Client initialized.")

    with open(ARTIFACTS_FILE, 'r') as f:
        data = json.load(f)

    # Fetch all notebooks to get source IDs (needed for trigger)
    print("Fetching notebook list...")
    all_notebooks = client.list_notebooks()
    notebook_sources_map = {nb.id: [s['id'] for s in nb.sources if s.get('id')] for nb in all_notebooks}

    for subject_id, content in data.items():
        notebook_id = content.get("notebookId")
        if not notebook_id:
            continue
            
        print(f"\nProcessing {subject_id}...")
        source_ids = notebook_sources_map.get(notebook_id, [])

        try:
            studio_artifacts = client.poll_studio_status(notebook_id)
            
            # 1. Update Slide Decks
            remote_slides = [a for a in studio_artifacts if a.get("type") == "slide_deck"]
            existing_slides = content.get("slideDecks", [])
            
            # Map by ID to preserve local info (like local file paths)
            updated_slides = []
            for rs in remote_slides:
                rs_id = rs.get("artifact_id")
                if not rs_id:
                    print(f"  Warning: Slide deck '{rs.get('title')}' has no artifact_id. Skipping.")
                    continue
                rs_url = rs.get("slide_deck_url")
                
                # Check if we already have this slide in artifacts.json
                existing = next((s for s in existing_slides if s.get("id") == rs_id), None)
                
                slide_entry = {
                    "id": rs_id,
                    "title": rs.get("title", "Presentation"),
                    "subtitle": existing.get("subtitle") if (existing and existing.get("subtitle")) else "Presentación detallada del tema.",
                    "type": "slide_deck",
                    "status": rs.get("status", "completed"),
                    "content": rs_url
                }
                
                # If we have a local path already, preserve it if the remote URL hasn't changed (or just keep it)
                # if existing and existing.get("content", "").startswith("/downloads/"):
                #      slide_entry["content"] = existing["content"]
                
                updated_slides.append(slide_entry)
            
            # If no slides found and none in progress, maybe trigger? 
            # (User wants a mirror, so we sync what exists)
            data[subject_id]["slideDecks"] = updated_slides
            print(f"  -> Synced {len(updated_slides)} Slide Decks.")

            # 2. Update Videos
            remote_videos = [a for a in studio_artifacts if a.get("type") == "video"]
            existing_videos = content.get("videos", [])
            
            updated_videos = []
            for rv in remote_videos:
                rv_id = rv.get("artifact_id")
                if not rv_id:
                     print(f"  Warning: Video '{rv.get('title')}' has no artifact_id. Skipping.")
                     continue
                rv_url = rv.get("video_url")
                
                existing = next((v for v in existing_videos if v.get("id") == rv_id), None)
                
                video_entry = {
                    "id": rv_id,
                    "title": rv.get("title", "Video Overview"),
                    "subtitle": existing.get("subtitle") if (existing and existing.get("subtitle")) else "Resumen audiovisual interactivo.",
                    "type": "video",
                    "status": rv.get("status", "completed"),
                    "content": rv_url
                }
                
                # if existing and existing.get("content", "").startswith("/downloads/"):
                #      video_entry["content"] = existing["content"]
                     
                updated_videos.append(video_entry)
            
            data[subject_id]["videos"] = updated_videos
            print(f"  -> Synced {len(updated_videos)} Videos.")

        except Exception as e:
            print(f"  Error syncing {subject_id}: {e}")

    with open(ARTIFACTS_FILE, 'w') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    print("\nSynchronization complete.")

if __name__ == "__main__":
    sync()
