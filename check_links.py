
import urllib.request
import urllib.error
import sys

# URLs extracted from artifacts.json (Step 276)
VIDEO_URL = "https://lh3.googleusercontent.com/notebooklm/ANHLwAwX-GRem5qCwSQuUzDb3C1PbnMmC05SQSHLiuTha4b5nA1ElOirpaypeNIvFcRa-0I5hbvRxKeC8R9xC_HNLKm0lzmiROHCHPr8bpSxhyksaRko1DPbQQ_VBohonTMHAM-XqORAZdoTgpQJifgVLDLe_uL03Sc=m22-dv"
SLIDE_URL = "https://contribution.usercontent.google.com/download?c=Cgpub3RlYm9va2xtEkYSD2FydGlmYWN0c19tZWRpYRozCiRhN2I1Y2M2YS1hODMxLTQ5YTQtODAxYS0yODEwYmUyZjYzMGQSCxIHEMyFveieBhgB&filename=Global_Cannabis_Bioeconomy_Strategy.pdf&opi=96797242"

def check_url(url, type_name):
    print(f"Checking {type_name}...")
    print(f"URL: {url[:50]}...")
    try:
        # Create a context to ignore SSL errors
        import ssl
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        
        # Create a request without any auth headers
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, context=ctx, timeout=10) as response:
            print(f"  Status: {response.status}")
            print(f"  Final URL: {response.geturl()}")
            
            # Check for redirect to login
            if "accounts.google.com" in response.geturl():
                print("  RESULT: 🔒 PRIVATE (Redirected to Google Login)")
            elif response.status == 200:
                print("  RESULT: ✅ PUBLICLY ACCESSIBLE (No login required)")
            else:
                 print(f"  RESULT: ❓ Unknown status {response.status}")

    except urllib.error.HTTPError as e:
        print(f"  Status: {e.code}")
        if e.code in [401, 403]:
            print("  RESULT: 🔒 PRIVATE (Access Denied)")
        else:
            print(f"  RESULT: ❌ Error ({e.reason})")
    except Exception as e:
        print(f"  RESULT: ❌ Error ({e})")
    print("-" * 30)

if __name__ == "__main__":
    check_url(VIDEO_URL, "VIDEO")
    check_url(SLIDE_URL, "SLIDE DECK")
