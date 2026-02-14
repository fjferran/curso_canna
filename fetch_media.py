
import subprocess
import sys
import os

def run_script(script_path):
    print(f"--- Running {os.path.basename(script_path)} ---")
    result = subprocess.run([sys.executable, script_path], capture_output=False)
    if result.returncode != 0:
        print(f"Error: {script_path} failed with exit code {result.returncode}")
        return False
    return True

def main():
    # 1. Sync Notebooks
    if not run_script("scripts/sync_notebooks.py"):
        sys.exit(1)
    
    # 2. Download Assets
    if not run_script("scripts/download_assets.py"):
        sys.exit(1)
        
    print("\nMirror synchronization complete.")

if __name__ == "__main__":
    main()
