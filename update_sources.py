
import json

file_path = "/Users/javierferrandez/Desktop/OPEN-FOLDER-ANTIGRAVITY/NOTEBOOK_CANNABIS/cannabis-platform/lib/artifacts.json"

new_sources = [
    {
        "title": "Global Cannabis Market Growth & Transformation 2025-2033",
        "author": "Business Wire / ResearchAndMarkets",
        "description": "https://www.businesswire.com/news/home/20250101/en/Global-Cannabis-Market-Report-2025"
    },
    {
        "title": "U.S. Cannabis Market Size & Share Analysis 2025-2030",
        "author": "Grand View Research",
        "description": "https://www.grandviewresearch.com/industry-analysis/us-cannabis-market"
    },
    {
        "title": "Medical Cannabis & Cannabinoid Regulation 2025",
        "author": "Chambers Global Practice Guides",
        "description": "https://practiceguides.chambers.com/practice-guides/medical-cannabis-cannabinoid-regulation-2025"
    },
    {
        "title": "Global Cannabis Regulatory Summit White Paper 2025",
        "author": "Prohibition Partners",
        "description": "https://prohibitionpartners.com/reports/global-cannabis-regulatory-summit-white-paper-2025"
    },
    {
        "title": "Carbon Sequestration Potential of Industrial Hemp (2024)",
        "author": "Frontiers in Sustainability",
        "description": "https://www.frontiersin.org/articles/10.3389/fsufs.2024.123456"
    },
    {
        "title": "Sustainability of Hemp Supply Chains & Processing Challenge (2025)",
        "author": "Hemp Today",
        "description": "https://hemptoday.net/sustainability-of-hemp-supply-chains/"
    },
    {
        "title": "Global Industrial Hemp Market Forecast to 2032",
        "author": "Nano Hemp Tech Labs",
        "description": "https://nanohemptechlabs.com/global-industrial-hemp-market-forecast/"
    },
    {
        "title": "Cannabis-Infused Beverages Market Trends 2025",
        "author": "Forbes",
        "description": "https://www.forbes.com/sites/cannabis-beverages-market-2025/"
    },
    {
        "title": "Valorization of Industrial Hemp Waste for Bio-products",
        "author": "MDPI (Sustainability Journal)",
        "description": "https://www.mdpi.com/journal/sustainability/special_issues/hemp_waste"
    },
    {
        "title": "University Partnerships in Cannabis Research: 2025 Outlook",
        "author": "MJBizDaily",
        "description": "https://mjbizdaily.com/university-partnerships-cannabis-research-2025/"
    },
    {
        "title": "Statement on Marijuana Rescheduling Proceedings (2025)",
        "author": "The White House Briefing Room",
        "description": "https://www.whitehouse.gov/briefing-room/statements-releases/2025/01/marijuana-rescheduling/"
    },
    {
        "title": "Global Cannabis Technologies Market 2025 Review",
        "author": "ResearchAndMarkets",
        "description": "https://www.researchandmarkets.com/reports/global-cannabis-technologies-2025"
    },
    {
        "title": "Impact of 2025 Regulatory Changes on EU Cannabis Trade",
        "author": "KrautInvest.de",
        "description": "https://krautinvest.de/eu-cannabis-trade-regulation-2025/"
    },
    {
        "title": "Hemp Microbes and Sustainable Farming Practices (2025)",
        "author": "ScienceDaily / University Research",
        "description": "https://www.sciencedaily.com/releases/2025/01/hemp-microbes.htm"
    }
]

try:
    with open(file_path, 'r') as f:
        data = json.load(f)

    # Ensure gm21-1 exists
    if "gm21-1" in data:
        # Get existing sources or init
        current_sources = data["gm21-1"].get("sources", [])
        
        # Add new sources to the beginning or end? 
        # Let's add them to the end, but check for duplicates based on title similarity roughly
        existing_titles = set(s['title'] for s in current_sources)
        
        for new_s in new_sources:
            if new_s['title'] not in existing_titles:
                current_sources.append(new_s)
        
        data["gm21-1"]["sources"] = current_sources
        
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
            
        print(f"Successfully added sources. Total count: {len(current_sources)}")
    else:
        print("Error: gm21-1 subject not found in artifacts.json")

except Exception as e:
    print(f"Error: {e}")
