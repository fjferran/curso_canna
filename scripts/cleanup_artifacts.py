import json
import os

def cleanup_artifacts():
    file_path = 'lib/artifacts.json'
    if not os.path.exists(file_path):
        print(f"File {file_path} not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for subject_id, content in data.items():
        if "videos" in content:
            original_videos = content["videos"]
            seen_titles = set()
            cleaned_videos = []
            
            # Sort to prioritize valid local paths
            # We want those with 'video_pv_' or masterclass 'parte' content
            sorted_videos = sorted(original_videos, key=lambda x: (
                1 if x.get('content') and 'video_pv_' in x.get('content') else 0,
                1 if 'parte' in x.get('title', '').lower() else 0,
                1 if x.get('content') and not x.get('content', '').endswith('video_premium-.mp4') else 0
            ), reverse=True)

            # Filter Rule: If it's a masterclass subject (has 'parte' videos), 
            # we keep ONLY the 'parte' videos.
            has_masterclass = any('parte' in v.get('title', '').lower() for v in sorted_videos)
            
            for video in sorted_videos:
                title = video.get('title', '').strip()
                url = video.get('content')
                
                # Rule 1: No duplicates
                if title in seen_titles:
                    continue
                
                # Rule 2: No broken placeholders
                if url and 'video_premium-.mp4' in url:
                    continue
                
                # Rule 3: If has masterclass, only keep 'parte' videos
                if has_masterclass and 'parte' not in title.lower():
                    continue

                # Rule 4: If no masterclass, limit to top 3 relevant ones
                if not has_masterclass and len(cleaned_videos) >= 3:
                    continue

                seen_titles.add(title)
                cleaned_videos.append(video)
            
            # Final check: limit to a reasonable number if still too many?
            # User says "solo los del notebook relacionados"
            # If we have many premium overviews, maybe we only keep the one with "Audio Overview" in name if exists
            
            content["videos"] = cleaned_videos

        if "slideDecks" in content:
            original_slides = content["slideDecks"]
            seen_slide_titles = set()
            cleaned_slides = []
            
            for slide in original_slides:
                title = slide.get('title', '').strip()
                url = slide.get('content')
                slide_id = slide.get('id', '')

                # Rule 1: No duplicates
                if title in seen_slide_titles:
                    continue
                
                # Rule 2: In introductory sections, we generally only want 
                # premium/notebook generated decks. External PDFs are usually 'sources'.
                # We filter out titles that are URLs or don't have a premium ID.
                is_premium = slide_id.startswith('premium-slide-')
                is_url_title = title.startswith('http') or title.endswith('.pdf')
                
                if not is_premium and is_url_title:
                    continue
                
                if not url:
                    continue

                seen_slide_titles.add(title)
                cleaned_slides.append(slide)
            
            content["slideDecks"] = cleaned_slides

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    
    print("Cleanup complete. Duplicates and broken links removed.")

if __name__ == "__main__":
    cleanup_artifacts()
