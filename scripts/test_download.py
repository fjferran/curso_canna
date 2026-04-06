import httpx
import os

url = "https://contribution.usercontent.google.com/download?c=Cgpub3RlYm9va2xtEkYSD2FydGlmYWN0c19tZWRpYRozCiQ1ZGMyMDAzMy1iYTNjLTQ3MDQtODE0YS1jZjJkN2ZlN2ZmODcSCxIHEMyFveieBhgB&filename=Technical_Cannabis_IPM.pdf&opi=96797242"
cookie = open("cookie.txt").read().strip()

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "es-ES,es;q=0.9",
    "Referer": "https://notebooklm.google.com/",
    "Cookie": cookie
}

client = httpx.Client(headers=headers, follow_redirects=True)
response = client.get(url)

print(f"Status: {response.status_code}")
print(f"URL: {response.url}")
content_type = response.headers.get("Content-Type", "")
print(f"Content-Type: {content_type}")

if "html" in content_type:
    # Print a snippet of the HTML to see the error
    print("HTML snippet:")
    print(response.text[:500])
else:
    print(f"Downloaded {len(response.content)} bytes.")
    with open("public/downloads/gm21-2/Technical_Cannabis_IPM.pdf", "wb") as f:
        f.write(response.content)
    print("Saved to public/downloads/gm21-2/Technical_Cannabis_IPM.pdf")
