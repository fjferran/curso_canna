import json
import os

artifacts_file = "lib/artifacts.json"

# Data collected from MCP mcp_notebooklm_studio_status
premium_data = {
    "gm21-1": {
        "videos": [
            {"title": "Cannabis: Industria y Agronomía (Audio Overview)", "url": "https://lh3.googleusercontent.com/notebooklm/ANHLwAy-ilgBnH5oX3hznULW9EYoZJNobn7S5CsWlk8xq3or9DlVX4dFuHumVJzcaBRR3UuwqZiAZXjDOMo4pc1pAJiRJptwPURKqfWjlfl-CUxXJFwjopBUOt_K3H2lyDhWPwsEWi7op0D8EF0jqj-dWMn9_YpeMiU=m22-dv"},
            {"title": "La solución climática de 8000 M€ de Irlanda", "url": "https://lh3.googleusercontent.com/notebooklm/ANHLwAwvOe4mcg3h6wLQ1JIzfcMDaxnQ5EaNChMRtcSGnSfq4BJ32-Goky8MypzeKdin1Vq0hT4OCenBrv1zq5LE_iCLU9Jn8P5CJtRAB1F9FOXgSEhvPlq0hvTRTMM6Y1hvOLxwkcDcVKFP4f29p-VEeJCTc-du0Ro=m22-dv"}
        ],
        "slideDecks": [
            {"title": "Global Cannabis Bioeconomy Strategy", "url": "https://contribution.usercontent.google.com/download?c=Cgpub3RlYm9va2xtEkYSD2FydGlmYWN0c19tZWRpYRozCiRhN2I1Y2M2YS1hODMxLTQ5YTQtODAxYS0yODEwYmUyZjYzMGQSCxIHEMyFveieBhgB&filename=Global_Cannabis_Bioeconomy_Strategy.pdf&opi=96797242"},
            {"title": "CANNABIS INDUSTRY STANDARDIZATION 2026", "url": "https://contribution.usercontent.google.com/download?c=Cgpub3RlYm9va2xtEkYSD2FydGlmYWN0c19tZWRpYRozCiQ1MjNjZjJjYi1lNDVjLTQxOGItODNiZS05MzYxYjlhNWY5NWUSCxIHEMyFveieBhgB&filename=CANNABIS_INDUSTRY_STANDARDIZATION_2026.pdf&opi=96797242"},
            {"title": "Cannabis Global Industry Realignment", "url": "https://contribution.usercontent.google.com/download?c=Cgpub3RlYm9va2xtEkYSD2FydGlmYWN0c19tZWRpYRozCiQ3MjhhNGRhMS05YWVhLTQ5ZGMtYjRjYS1hZGIxMDZkZTU4YWYSCxIHEMyFveieBhgB&filename=Cannabis_Global_Industry_Realignment.pdf&opi=96797242"},
            {"title": "Hemp A National Climate Strategy", "url": "https://contribution.usercontent.google.com/download?c=Cgpub3RlYm9va2xtEkYSD2FydGlmYWN0c19tZWRpYRozCiQ3MThjZTk5YS01M2ViLTQzMTAtYmMwYy1hOTZiNzQzMzY2ZTYSCxIHEMyFveieBhgB&filename=Hemp_A_National_Climate_Strategy.pdf&opi=96797242"}
        ]
    },
    "gm21-2": {
        "videos": [
            {"title": "Principios Diseño Invernaderos (Audio Overview)", "url": "https://lh3.googleusercontent.com/notebooklm/ANHLwAzOzJDCtTjNMgH4x8EUC5O2TyBMQyDD6bHy3VtKKLGbTDs4Nfm8HRhVGVLZcf6ZG3scC-0lxIoosvA2FMKoZVz-DYDBYS6PC9ihLHraOPNKZJCotE8bpZvle2JSQLeSmr3qJcQpfgID6zZx0b5H_weyCnFg7g=m22-dv"},
            {"title": "Cultivo Interior: Ecosistema Controlado", "url": "https://lh3.googleusercontent.com/notebooklm/ANHLwAzvtQ3Or_sR6AoHOKG9m9b4iTUqG_cJKmwMrjdy-ESZa-AEPrId2FmuNdB7IvZJVsXbcWCQ-ltpR0-5VjOq62Hxt3FqRYAmEKIst83DmKZJEvZi4-lXpVnR1R8V55QybiKdnLBH156u7aLphQBm8UfZNOavYUo=m22-dv"},
            {"title": "Cultivo Moderno de Cannabis", "url": "https://lh3.googleusercontent.com/notebooklm/ANHLwAy2CsExLW1OD3hI5YsoN2VYYHg999Vb4RNg_bCtH6Pko8YgN9b4DIW3e6E6HzN0Shdo_zvjCI_dUI_HMkKYrtw9DzfzaypQjPVibVP2_D9qrQj2KafeU48HB48UhdClKErNAnrJVNNpD-4AkGDeoKFqvIBcdj8=m22-dv"},
            {"title": "Daniel Morales: Iluminación", "url": "https://lh3.googleusercontent.com/notebooklm/ANHLwAwhJ-RYVUpZbol6eCULrCnmOIe7GopUFyJkXOZaPAF8bWau9rnDcWGcbzbOgw2NSaDarK6N5CWwiwVbsfm6bVufMSE_T5upnLpv5EHiNjeN5LdXgKGP9pQvNtIMaDGpk1JrNrwA_QrTLOv7u3hy0uWWYRKPHZA=m22-dv"},
            {"title": "Herminia Puerto: Cultivo Sin Suelo", "url": "https://lh3.googleusercontent.com/notebooklm/ANHLwAzbnsrWUjr_sUnmj1l9XB1URlOmGJe_En9s7rB38_GC4U0Khq3V6ztjd-YvrNFqpYS-7Hu7yFTxGVL0zpKbNM6irFA7MSW4x7z9KrOZpEEvdHY0MktB6peW7eKBBcQ9D8gCo1NYOqea2gtLndCo3Fl9RRZl6Gc=m22-dv"},
            {"title": "Jose Maria Camara: Control Climático", "url": "https://lh3.googleusercontent.com/notebooklm/ANHLwAyFNczA-VxjLQwMe0453Hhl5ETdFYOB7HE2LqC86kJYulW6C4PX3dkEEAVInn13t7Zpmy_dfTibR12nibGQVpM22EpY3UoYlxXPZxyBGU8mZ0EEz8LMQSRCh3TywJySDOdsxIB98w2L_9DX7NF3Frv3u_Oy-5M=m22-dv"}
        ],
        "slideDecks": [
            {"title": "Cannabis Ingeniería de Biosistemas", "url": "https://contribution.usercontent.google.com/download?c=Cgpub3RlYm9va2xtEkYSD2FydGlmYWN0c19tZWRpYRozCiQ0NDIxNzE3ZC0xMDY2LTQwNDAtYTI4ZS1iZDUyNzc4ZTgwNTgSCxIHEMyFveieBhgB&filename=Cannabis_Ingeniería_de_Biosistemas.pdf&opi=96797242"}
        ]
    },
    "gm21-3": {
        "videos": [
            {"title": "Cannabis: Interior vs. Exterior (Audio Overview)", "url": "https://lh3.googleusercontent.com/notebooklm/ANHLwAx2glI-yacGzX6hs5JZk5kpDl-w8T6W_SSL-Y-eBIr3GXvBMxNFd8-Ojf11MWWXqRsP9Ojlkc67NhScz_QvKitneBEeMSdRLnOjvwrvi2eu6s1OKYBwCXkevVEspYsDiCqsqK7Fe2C2esVlh2hg3hZe3FURQTo=m22-dv"},
            {"title": "Cultivo Regenerativo: Cannabis", "url": "https://lh3.googleusercontent.com/notebooklm/ANHLwAyVDdJARl-COlxUjSq1g_y87Os6mQo21DzCO4PO1FGYEWs7oewIALNQ2R34CCyPn4Fc5fUqd37ABQqK6jApBxxGd45MtayRGVeFcJZhB0SO9QnNjxud2KG5fDPonl0cYrg0YnLgbe6ZqLCzGeU09xl8KUeaiko=m22-dv"},
            {"title": "Cáñamo: ¿Milagro o Marketing?", "url": "https://lh3.googleusercontent.com/notebooklm/ANHLwAxNK2XIV4iZGViSZSyS7UiBPwU8SUiGXFEIbHROGbyI5qgpPO5r3Jw-h6c4xmRN7DbgRm9LZ7gVSWcRQWSWAGGzyTLSoFAGX4VyykspKxPwVG93E7mG6srgcZxJKk-mN1THPni-YS6pcJUU6cH8bwPb5FBm3Ww=m22-dv"}
        ],
        "slideDecks": [
            {"title": "Regenerative Cannabis Cultivation", "url": "https://contribution.usercontent.google.com/download?c=Cgpub3RlYm9va2xtEkYSD2FydGlmYWN0c19tZWRpYRozCiQ4ZjMyNDk0MS0zZmQ0LTRkNDQtODkyNi1mNDI0MTY3YmU3NWISCxIHEMyFveieBhgB&filename=Regenerative_Cannabis_Cultivation.pdf&opi=96797242"},
            {"title": "Cultivo Exterior Cannabis Regenerativo", "url": "https://contribution.usercontent.google.com/download?c=Cgpub3RlYm9va2xtEkYSD2FydGlmYWN0c19tZWRpYRozCiQ1YWYyYjMxOC1jY2IwLTQ0YzItYWIwOS0zMDM1NzgwYzMxMzcSCxIHEMyFveieBhgB&filename=Cultivo_Exterior_Cannabis_Regenerativo.pdf&opi=96797242"}
        ]
    },
    "gm21-4": {
        "videos": [
            {"title": "El Tesoro del Cáñamo (Audio Overview)", "url": "https://lh3.googleusercontent.com/notebooklm/ANHLwAxcCvYY9cSAp2GQcqYs520-F3axWy-a_JHjOi7CYAUZ955u09zjOi24LfCzbFfsFmyQ3OG2CFFHYnsnSZx10uK7JJCVI4NVOFvnUcjwVizcLYQoPuxWYGnwRNqq2Ud9Q-4pp5XlE_BcGSm38rrGzNzaE7G2ddY=m22-dv"},
            {"title": "El Cáñamo: La Super-Planta", "url": "https://lh3.googleusercontent.com/notebooklm/ANHLwAyAEfgchTvh06KnD5UjqjJpCjxTkxmRTRln-LJBjsopAVGkhEM0wn4OzHxmWgooG7ptZ55Ey6fFAm5FmQi6B5rOCEoPs6X1tWd8_RKtmwfqJRR4vr-HTKHfQG7UCtEnMnCtfD18Veu4Rvuq5l01JiJvqrYxdw=m22-dv"},
            {"title": "La revolución plástica del cáñamo", "url": "https://lh3.googleusercontent.com/notebooklm/ANHLwAwOiZ3bIze3Z-k8p0acXShTiqTZp0k10gGJxAv0w4ap7zjeAXcLMGD53cfeWZG_a5p8Hb6VFSaUQmI2qufnEFbvYXnW9LhjNWXE_dHaLqXGdczKIKjiXgfSnAIoBQfFW6qR0fYYXXJ3i9YWwqpDdacKsaI3Iwk=m22-dv"}
        ],
        "slideDecks": [
            {"title": "The Hemp Biorefinery", "url": "https://contribution.usercontent.google.com/download?c=Cgpub3RlYm9va2xtEkYSD2FydGlmYWN0c19tZWRpYRozCiQ1NWRiMTMwNS04M2ZiLTQwNjgtOWIwYy0wNWVkZmU5YTJhOTMSCxIHEMyFveieBhgB&filename=The_Hemp_Biorefinery.pdf&opi=96797242"},
            {"title": "Cáñamo Industrial Bioeconomía Circular", "url": "https://contribution.usercontent.google.com/download?c=Cgpub3RlYm9va2xtEkYSD2FydGlmYWN0c19tZWRpYRozCiQyYjY1OThhYy1mZGViLTQ0NDgtYWU3Mi0wZTQ4M2NiN2NkOTcSCxIHEMyFveieBhgB&filename=Cáñamo_Industrial_Bioeconomía_Circular.pdf&opi=96797242"}
        ]
    },
    "gm20-1": {
        "videos": [
            {"title": "Cannabis: La Revolución Tech (Audio Overview)", "url": "https://lh3.googleusercontent.com/notebooklm/ANHLwAzU-y-uHbKihJMSOrPCFzvQi2pECztCvVWAaBU0ctQNpCa-1yE73hS2PksfCnNyszw0B069JMh4WN1NbmO7NJCVE7UlSwblWQcxGj8ZS4xivtsjMcT3LQ0czzv5q4f7BmT4JdzVZdQBY4obshl1fuLL6U5S0ac=m22-dv"},
            {"title": "Revolución IA en el Cannabis", "url": "https://lh3.googleusercontent.com/notebooklm/ANHLwAxqWpiviWj9xrT4SzxTi1Nwm2EkPkAoA2kEmc5PnHn6GjnW7uQoevLTdcf7dhDfDhpmEBUj4IsN_bIMxAZ3DCiwYgpT11Oq54I2Et8sQJuUgVBdUdSIeS6lqV5U-AE2_fWrO3zxnyaUXWQFQHfgAZ1yGEUX2j8=m22-dv"},
            {"title": "Carmen Rocamora: Agricultura de Precisión", "url": "https://lh3.googleusercontent.com/notebooklm/ANHLwAyeulMlkABqIMpKLJ-7maQYJfYVgvele_2609sgFv1EnpCb3tIAUbJNHDL_sVxDgU-I7BfU7ZEnBx0qlxHTXMIVQo6Ip0eT2_I6EOSV2faqVePjiPOYelkUuwfNQ4G0fwVMppaYc0tvOHDFGy3RNYRvLEWxfYA=m22-dv"},
            {"title": "Home Assistant a fondo (Audio)", "url": "https://lh3.googleusercontent.com/notebooklm/ANHLwAy7_dfffzShC9a0gFS2rEPO8E6v5dOeWWsLBnAAyoG21F6aIDGHgYuKrJOx-tYS4LrUWB3Z9Nuwv5lz3D_RR6PzeyDrnsDVnXxz_D2uIdvuI0Lj2TI0Ck3bR2otREG7dQqs77CknqTRIL0FodY2eVeAlxfzK1M=m140-dv"}
        ],
        "slideDecks": [
            {"title": "Cultivo Inteligente 40", "url": "https://contribution.usercontent.google.com/download?c=Cgpub3RlYm9va2xtEkYSD2FydGlmYWN0c19tZWRpYRozCiRiMzBlNTc0NC04ZWMyLTRmZmYtODlhNC1kNWU2ZjNiNDUyMTQSCxIHEMyFveieBhgB&filename=Cultivo_Inteligente_40.pdf&opi=96797242"}
        ]
    },
    "gm20-2": {
        "videos": [
            {"title": "El Laberinto Legal del Cannabis en España (Audio Overview)", "url": "https://lh3.googleusercontent.com/notebooklm/ANHLwAzi0_Sue7zvfzxxXRIduT5g5cT-RhkUFiCEAeDrLrQymq0wq63M5fZ3PUCTtcdIwm1dyuPcwaFUFJFF_49f-2Nk3DTGD0v5Pv8w6FIsYHtB_caiFajl65EkE1-tId0uTDP-xrh5Kai0dq0cah1iTUjB435h0Ro=m22-dv"},
            {"title": "La paradoja del cannabis", "url": "https://lh3.googleusercontent.com/notebooklm/ANHLwAxJ2r62YctN2OCYarmMdDXxSkoa-S7__SNA4e02R5ned29Z0WV1OjINi7wA4NLYSeT4ft2zvbfvXcMUR8AdZH8uSkX5sn8PbKJsuTrjy-f6zOl3XFr4unIASi-z0i1NgIaS8S6VtdQEX6DZBxJDAdCstWBhQuk=m22-dv"}
        ],
        "slideDecks": [
            {"title": "Regulación Cannabis España Estrategia Legal", "url": "https://contribution.usercontent.google.com/download?c=Cgpub3RlYm9va2xtEkYSD2FydGlmYWN0c19tZWRpYRozCiQ3MDFiZmZlOC1hYTBjLTQxNTctYTdhNi04YTMyNGMxOGFkZmQSCxIHEMyFveieBhgB&filename=Regulación_Cannabis_España_Estrategia_Legal.pdf&opi=96797242"}
        ]
    },
    "gm20-3": {
        "videos": [
            {"title": "La Economía del Cannabis (Audio Overview)", "url": "https://lh3.googleusercontent.com/notebooklm/ANHLwAw-2r-9Fxf3ImwMlbDT7TpSnt0yf10_jWguSFJP5DZRKXBColWsbqsUaLNWCXbr-DXkGhtz7ta60GmN_pxnG0cWu2R1VFeiH_jbQSLZn8nccMAoAW4C4SGvbz3S1qor1CLZ5O4jju1jiYrmK6cnAmWDr4z8Hw=m22-dv"},
            {"title": "La anatomía del cannabis", "url": "https://lh3.googleusercontent.com/notebooklm/ANHLwAwSd3qFwPtPk9Dlg9OY7i0LTtpixly_tXe_021QWfZnFX5hwnYvf--j6CuQJ-kkCXQn84cBrKLpNFq0GJeG5efAkSfYOUbRBNy5O5KqSkliUyniMGTJqi_CGfQ5Zsx7BrRPoyH74V4IYsAJ6AnmB0ksxNY46LY=m22-dv"}
        ],
        "slideDecks": [
            {"title": "Cannabis Estrategia Horizonte 2026", "url": "https://contribution.usercontent.google.com/download?c=Cgpub3RlYm9va2xtEkYSD2FydGlmYWN0c19tZWRpYRozCiQ4ZTlmMDNlNi1iMzhmLTQzNWQtYjYzOC04OWNiNmViMzQyNmISCxIHEMyFveieBhgB&filename=Cannabis_Estrategia_Horizonte_2026.pdf&opi=96797242"}
        ]
    },
    "gm20-4": {
        "videos": [
            {"title": "El Cannabis y Tu Cuerpo (Audio Overview)", "url": "https://lh3.googleusercontent.com/notebooklm/ANHLwAxS18jhvNWCrLoM_fsuwOFaqHel5PDNTwyaomKfksrgY6G-ebrAYA8khRIHOalF4yTN3WdPwyn_zmh7iedF65wIZUfXslP8g0TE8TCxq6fSTWUHbKvSb8oO0q5PadMWPRyxMv304jqOsqWGIscR668Toaixjgs=m22-dv"},
            {"title": "Cannabis: Hype vs. Ciencia", "url": "https://lh3.googleusercontent.com/notebooklm/ANHLwAw4kcUvdChkH8GxmdwC9yvAM2W-q0BXRLQem3y0wZA64krtKlJ2THkjPQaV8-W1xeXHF1h5r1SPfOo7b96PM_242eG8OhazT3vRO2mhuQPipxiptJubhcz7ajgw8zTtchoyW3JFRdUbo5-GB5VT0boNFPWkDcs=m22-dv"}
        ],
        "slideDecks": [
            {"title": "Cannabinoid Medicine Science and Evidence", "url": "https://contribution.usercontent.google.com/download?c=Cgpub3RlYm9va2xtEkYSD2FydGlmYWN0c19tZWRpYRozCiQ5NjUxY2I4OC01NjhjLTQwNzMtOGVlNS04ZjczOTIzZWRhMjUSCxIHEMyFveieBhgB&filename=Cannabinoid_Medicine_Science_and_Evidence.pdf&opi=96797242"}
        ]
    },
    "gm20-5": {
        "videos": [
            {"title": "El Futuro del Cannabis (Audio Overview)", "url": "https://lh3.googleusercontent.com/notebooklm/ANHLwAzFH0Vkf1786xxbb7GedGrmAD29LQvXNMiuzWQKSdgB7TBlCy-67laaBxRHXstgBo5cWlsBnw74aEutiH1keTiRNtchOMiB9D-9Olxi-42NDyQkLgmMimgb60-dyqY1TNsLOk7JoLbaOZlrCk3aLrO3O_A-rAg=m22-dv"},
            {"title": "La paradoja del cannabis", "url": "https://lh3.googleusercontent.com/notebooklm/ANHLwAyM2bRbs-DZC_BopayBKUK4TF5iWOoU_sazrG86-D2RRhj0syk2m6cGe7w4_v8OoaAEa2gXQo8FD7sCH9le7aJMjrw0jNMmoEE996W1oVpEc7kDWaQz_xZDnBR5ll5K-UbFVHJngTXtHAOP31hBHoCQPXWvPw=m22-dv"}
        ],
        "slideDecks": [
            {"title": "Cannabis Estrategia Global", "url": "https://contribution.usercontent.google.com/download?c=Cgpub3RlYm9va2xtEkYSD2FydGlmYWN0c19tZWRpYRozCiQwMTM4Y2Y4MS1lMDRjLTRkMDItODQ1MS0yZGIxYzUxN2E4MmQSCxIHEMyFveieBhgB&filename=Cannabis_Estrategia_Global.pdf&opi=96797242"}
        ]
    }
}

if os.path.exists(artifacts_file):
    with open(artifacts_file, "r") as f:
        artifacts = json.load(f)
else:
    artifacts = {}

for subject_id, data in premium_data.items():
    if subject_id not in artifacts:
        artifacts[subject_id] = {"subjectId": subject_id, "videos": [], "slideDecks": [], "sources": []}
    
    # Merge Videos
    existing_video_urls = [v.get("url") for v in artifacts[subject_id].get("videos", []) if v.get("url")]
    for v in data["videos"]:
        if v["url"] not in existing_video_urls:
            # Check if a video with SAME url already exists (ignoring prefix etc)
            artifacts[subject_id]["videos"].append({
                "id": f"premium-video-{abs(hash(v['url'])) % 10000}",
                "title": v["title"],
                "type": "video",
                "content": v["url"],
                "status": "completed"
            })
    
    # Merge Slide Decks
    existing_slide_urls = [s.get("url") for s in artifacts[subject_id].get("slideDecks", []) if s.get("url")]
    for s in data["slideDecks"]:
        if s["url"] not in existing_slide_urls:
            artifacts[subject_id]["slideDecks"].append({
                "id": f"premium-slide-{abs(hash(s['url'])) % 10000}",
                "title": s["title"],
                "type": "slide_deck",
                "content": s["url"],
                "status": "completed"
            })

with open(artifacts_file, "w") as f:
    json.dump(artifacts, f, indent=2)

print(f"Updated {artifacts_file} with {len(premium_data)} premium artifacts.")
