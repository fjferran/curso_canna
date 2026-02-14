
import json
import re

raw_data = [
    [["a29e49f4-72ad-40d1-9d9a-639ae11afcd4"],"",[None,3214,[1769891662,787486000],["b19c435e-101b-4305-8982-ee7785dc9b80",[1769891662,439632000]],5,None,2,["https://www.globalgrowthinsights.com/blog/here-s-the-top-20-list-of-medical-cannabis-companies-2025-global-growth-insights-1001#:~:text=Leading%20companies%20including%20Canopy%20Growth,neurology%2C%20and%20chronic%20pain%20management."]],[None,2]],
    [["ad3e7347-c580-4cba-a7c7-01b3549ff98f"],"(PDF) A review of the industrial use and global sustainability of ...",[None,22207,[1769891662,787486000],["6402d31b-0b17-4aa6-b78b-433b0373143b",[1769891662,439632000]],5,None,2,["https://www.researchgate.net/publication/374381925_A_review_of_the_industrial_use_and_global_sustainability_of_Cannabis_sativa"]],[None,2]],
    [["0d8ea21c-dd41-4684-8d01-e7f30f22bf6c"],"(PDF) Complete biosynthesis of cannabinoids and their unnatural analogues in yeast",[None,12921,[1769891662,787486000],["286ddc1b-1958-4bfb-92c0-a8cacbb45ad5",[1769891662,439632000]],5,None,2,["https://www.researchgate.net/publication/331938886_Complete_biosynthesis_of_cannabinoids_and_their_unnatural_analogues_in_yeast"]],[None,2]],
    [["04834710-4f2f-4408-b7e8-78fb26d3c5dd"],"(PDF) HEMP (Walter Brennan,2025) - ResearchGate",[None,32899,[1769891662,787486000],["1c5ee523-0275-47ab-ad1d-e99d5165e7ad",[1769891662,439632000]],5,None,2,["https://www.researchgate.net/publication/395535670_HEMP_Walter_Brennan2025"]],[None,2]],
    [["a95b8002-187b-4303-88df-f1d43311f8ce"],"10 Biggest Cannabis Stocks in the US and Canada in 2026 - Investing News Network",[None,2269,[1769891662,787486000],["426ec968-7dcd-460f-b8a3-d4db038d04b6",[1769891662,439632000]],5,None,2,["https://investingnews.com/daily/cannabis-investing/american-cannabis-stocks/"]],[None,2]],
    [["04f1c3eb-bfdf-48cf-94b9-ff8cdad5f560"],"2025 CannaTech Innovation Award Winners - Cannabis & Tech Today",[None,1845,[1769891662,787486000],["76f855ee-a70c-4196-bbd5-7570c4886b19",[1769891662,439632000]],5,None,2,["https://cannatechtoday.com/2025-cannatech-innovation-award-winners/"]],[None,2]],
    [["c9c77ae9-53b0-4f68-b5aa-ec9623b6231b"],"VALUE CHAIN ANALYSIS OF INDUSTRIAL HEMP: AN EXTENSIVE REVIEW AND A CASE OF NEPAL",[None,11591,[1769891662,787486000],["5466758b-7efe-40ba-bcfa-fa98697e3b5a",[1769891662,439632000]],3,None,2,["https://research.usq.edu.au/download/79dabf75071347f890a936f6045ccaa5180c808ce5188b2fac0e4b0b6aa3966d/21886947/Rajan%20Budhathoki%20-%20THESIS.pdf"]],[None,2]],
    [["3398a934-d45c-4a8f-8c56-c94cde685c6f"],"Vergara's Picks for \"Top 5 Cannabis sativa Research Papers for 2025\"- Harvest New York",[None,796,[1769891662,787486000],["b11b6f96-8f27-4ae3-8ae0-b82825a1d810",[1769891662,439632000]],5,None,2,["https://harvestny.cce.cornell.edu/submission.php?id=174&crumb=emerging_crops|8"]],[None,2]],
    [["59297f3f-a21c-424a-8635-132864bf415c"],"Volatility, Uncertainty, Complexity, and Ambiguity in ... - HEC Montréal",[None,55635,[1769891662,787486000],["477bd37f-35df-4db3-9fee-978ac94989b4",[1769891662,439632000]],3,None,2,["https://biblos.hec.ca/biblio/memoires/hibanada_manolito_m2021.pdf"]],[None,2]],
    [["65a0dbe5-1827-4080-9d8f-959bb88f8f3d"],"What Are the Top 12 Medical Cannabis Companies in 2025? - Global Growth Insights",[None,3214,[1769891662,787486000],["d62a63c4-ff9a-4fd7-92cf-fe23cfdabe4d",[1769891662,439632000]],5,None,2,["https://www.globalgrowthinsights.com/blog/here-s-the-top-20-list-of-medical-cannabis-companies-2025-global-growth-insights-1001"]],[None,2]],
    [["9bcbcae6-a27e-459a-ad72-e4243b467af0"],"“Bounded Equity: The Limits of Economic Models of Social Justice in Cannabis Legislation” - PMC - PubMed Central",[None,8811,[1769891662,787486000],["d65b12ae-66cd-483d-be84-46ca99c1ce70",[1769891662,439632000]],5,None,2,["https://pmc.ncbi.nlm.nih.gov/articles/PMC10373104/"]],[None,2]]
]

def clean_title(title):
    if not title: return ""
    # Remove (PDF) prefix
    title = re.sub(r'^\(PDF\)\s*', '', title)
    # Remove trailing - Source
    title = re.sub(r'\s*-\s*[^-]+$', '', title) 
    return title.strip()

def extract_author(title, url):
    # Heuristics for author or source
    if "Walter Brennan" in title: return "Walter Brennan"
    if "ResearchGate" in title or "researchgate" in url: return "ResearchGate (Various)"
    if "Global Growth Insights" in title or "globalgrowthinsights" in url: return "Global Growth Insights"
    if "Investing News" in title or "investingnews" in url: return "Investing News Network"
    if "Cannabis & Tech Today" in title: return "Cannabis & Tech Today"
    if "Harvest New York" in title: return "Harvest New York"
    if "HEC Montréal" in title: return "HEC Montréal"
    if "PMC" in title or "ncbi.nlm.nih.gov" in url: return "PubMed Central"
    return "Fuente Externa"

cleaned_sources = []
for item in raw_data:
    try:
        raw_title = item[1]
        url_list = item[2][7]
        url = url_list[0] if url_list else "N/A"
        
        if not raw_title:
            if "globalgrowthinsights" in url:
                raw_title = "Top 20 Medical Cannabis Companies 2025"
            else:
                raw_title = "Fuente Web: " + url[:30] + "..."
        
        title = clean_title(raw_title)
        author = extract_author(raw_title, url)
        
        cleaned_sources.append({
            "title": title,
            "author": author,
            "description": url
        })
    except Exception as e:
        continue

print(json.dumps(cleaned_sources, indent=4, ensure_ascii=False))
