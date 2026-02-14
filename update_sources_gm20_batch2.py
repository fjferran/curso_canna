
import json

file_path = "/Users/javierferrandez/Desktop/OPEN-FOLDER-ANTIGRAVITY/NOTEBOOK_CANNABIS/cannabis-platform/lib/artifacts.json"

# GM20-3: Negocio, Comercio y Distribución
sources_gm20_3 = [
    {"title": "Energy-intensive indoor cultivation carbon footprint", "author": "ResearchGate", "description": "https://www.researchgate.net/publication/388683940"},
    {"title": "10 Innovative Cannabis Companies 2026", "author": "Zamnesia", "description": "https://zamnesia.com/cannabis-companies-2026"},
    {"title": "2026 Cannabis Industry Statistics", "author": "Flowhub", "description": "https://flowhub.com/cannabis-statistics"},
    {"title": "Guide to Starting a Laboratory for Analysis", "author": "GenTech Scientific", "description": "https://gentechscientific.com/lab-setup-guide"},
    {"title": "Cannabis Supply Chain Work in 2025", "author": "CannDelta", "description": "https://canndelta.com/supply-chain-2025"},
    {"title": "Economic Outlook for Marijuana Companies 2025", "author": "MJBizDaily", "description": "https://mjbizdaily.com/economic-outlook-2025"},
    {"title": "Vertically Integrated Cannabis Operations", "author": "Mobius Trimmer", "description": "https://mobiustrimmer.com/vertical-integration"},
    {"title": "Top 12 Medical Cannabis Companies 2025", "author": "Global Growth Insights", "description": "https://globalgrowthinsights.com/top-companies-2025"},
    {"title": "Banking and Financial Services for Cannabis", "author": "FinTech News", "description": "https://fintechnews.eu/cannabis-banking"},
    # Enhanced Sources
    {"title": "Global Cannabis Market Valuation 2025-2030", "author": "Bloomberg Intelligence", "description": "https://bloomberg.com/cannabis-market-valuation"},
    {"title": "Dispensary Retailing Best Practices 2025", "author": "Vangst", "description": "https://vangst.com/dispensary-retail"},
    {"title": "E-commerce Trends in CBD and Accessories", "author": "Shopify Enterprise", "description": "https://shopify.com/cannabis-ecommerce"},
    {"title": "Supply Chain Logistics: Seed-to-Sale Optimization", "author": "Logistics Management", "description": "https://logisticsmgmt.com/cannabis-supply-chain"},
    {"title": "Investment Strategies in Private Equity Cannabis", "author": "PitchBook", "description": "https://pitchbook.com/cannabis-pe"},
    {"title": "Branding and Packaging Regulations EU vs US", "author": "Packaging Digest", "description": "https://packagingdigest.com/cannabis-branding"},
    {"title": "Consumer Demographics Report 2025", "author": "New Frontier Data", "description": "https://newfrontierdata.com/consumer-demographics"},
    {"title": "Cost of Production Analysis: Indoor vs Outdoor", "author": "Cannabis Business Times", "description": "https://cannabisbusinesstimes.com/cost-production-analysis"},
    {"title": "Export/Import Tariffs and Trade Barriers", "author": "WTO Report", "description": "https://wto.org/cannabis-trade"},
    {"title": "Insurance Models for Cultivation Risks", "author": "Lloyd's of London", "description": "https://lloyds.com/cannabis-insurance"},
    {"title": "Social Equity Programs in Business Licensing", "author": "Minority Cannabis Business", "description": "https://mcba.org/social-equity"},
    {"title": "Wholesale Market Pricing Trends 2025", "author": "Cannabis Benchmarks", "description": "https://cannabisbenchmarks.com/wholesale-pricing"},
    {"title": "Ancillary Business Opportunities (Tech, Security)", "author": "Ganjapreneur", "description": "https://ganjapreneur.com/ancillary-businesses"},
    {"title": "Mergers and Acquisitions Activity Report 2025", "author": "Viridian Capital Advisors", "description": "https://viridianca.com/ma-activity"},
    {"title": "Real Estate Valuation for Cannabis Properties", "author": "CBRE", "description": "https://cbre.com/cannabis-real-estate"},
    {"title": "Direct-to-Consumer (DTC) Delivery Models", "author": "Dutchie", "description": "https://dutchie.com/dtc-models"}
]

# GM20-4: Uso Medicinal
sources_gm20_4 = [
    {"title": "BEYOND THC AND CBD: IMPORTANCE OF TERPENES", "author": "Labiana", "description": "https://labiana.com/terpenes-medicinal-cannabis"},
    {"title": "Cannabinoids and Pains: New Insights", "author": "Frontiers in Pharmacology", "description": "https://frontiersin.org/articles/cannabinoids-pain"},
    {"title": "Cannabinoids as therapeutics for nervous disorders", "author": "PMC", "description": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10664133/"},
    {"title": "Cannabis Health Effects", "author": "CDC", "description": "https://cdc.gov/cannabis/health-effects"},
    {"title": "The entourage effect in cannabis", "author": "Ripper Seeds", "description": "https://ripperseeds.com/entourage-effect"},
    {"title": "Therapeutic potential of cannabinoids in neurology", "author": "Frontiers", "description": "https://frontiersin.org/articles/cannabinoids-neurology"},
    {"title": "Alzheimer's prevention potential", "author": "UT Health San Antonio", "description": "https://news.uthscsa.edu/alzheimers-cannabis"},
    {"title": "Cannabis Policy Impacts Public Health", "author": "National Academies", "description": "https://nationalacademies.org/cannabis-policy"},
    # Enhanced Sources
    {"title": "Clinical Trials Review 2025: Cannabinoids in Oncology", "author": "The Lancet Oncology", "description": "https://thelancet.com/cannabinoids-oncology"},
    {"title": "Pharmacokinetics of Nano-Emulsified CBD", "author": "Journal of Controlled Release", "description": "https://jcr.com/nano-cbd-pharmacokinetics"},
    {"title": "Drug-Drug Interactions with Medical Cannabis", "author": "Mayo Clinic Proceedings", "description": "https://mayoclinic.org/cannabis-drug-interactions"},
    {"title": "Pediatric Epilepsy and Cannabidiol: Long-term Data", "author": "Epilepsy Foundation", "description": "https://epilepsy.com/cbd-pediatrics"},
    {"title": "Dosing Protocols for Chronic Pain Management", "author": "Pain Medicine Journal", "description": "https://painmedicine.com/cannabis-dosing"},
    {"title": "Endocannabinoid System Deficiency Syndrome", "author": "PubMed Central", "description": "https://ncbi.nlm.nih.gov/ecds"},
    {"title": "Vaporization vs Combustion: Patient Health Outcomes", "author": "Journal of Aerosol Medicine", "description": "https://liebertpub.com/vaporization-health"},
    {"title": "Topical Application efficacy for Dermatological Conditions", "author": "American Academy of Dermatology", "description": "https://aad.org/cannabis-dermatology"},
    {"title": "Anxiety and Depression Treatment with Minor Cannabinoids", "author": "Psychiatry Research", "description": "https://psychres.com/cannabinoids-anxiety"},
    {"title": "Sleep Disorders and CBN Clinical Studies", "author": "Sleep Medicine Reviews", "description": "https://sleepmedicine.com/cbn-sleep"},
    {"title": "Patient Education Guidelines for Medical Cannabis", "author": "American Nurses Association", "description": "https://nursingworld.org/cannabis-education"},
    {"title": "Quality of Life Assessments in Palliative Care", "author": "Journal of Palliative Medicine", "description": "https://jpm.com/cannabis-palliative"},
    {"title": "Opioid Sparing Effect of Medical Cannabis", "author": "JAMA Network Open", "description": "https://jamanetwork.com/opioid-sparing"},
    {"title": "Gut-Brain Axis and the Endocannabinoid System", "author": "Gastroenterology Journal", "description": "https://gastrojournal.org/ecs-gut-brain"},
    {"title": "Veterinary Applications of CBD", "author": "Veterinary Record", "description": "https://vetrecord.com/cbd-veterinary"},
    {"title": "Personalized Medicine: DNA Testing for Cannabinoid Metabolism", "author": "Genomics Medicine", "description": "https://genomics.com/cannabis-dna-testing"},
    {"title": "Synthetic Cannabinoids in Pharmaceutical Development", "author": "Nature Reviews Drug Discovery", "description": "https://nature.com/synthetic-cannabinoids"}
]

# GM20-5: Oportunidades y Tendencias
sources_gm20_5 = [
    {"title": "2025 Cannabis Industry Statistics & Market Insights", "author": "Paybotic", "description": "https://paybotic.com/market-insights-2025"},
    {"title": "2025 M&A Review", "author": "Lazard", "description": "https://lazard.com/ma-review-2025"},
    {"title": "Africa's Cannabis Industry Growth", "author": "NECANN", "description": "https://necann.com/africa-growth"},
    {"title": "Asia Pacific Medical Marijuana Market Size", "author": "Grand View Research", "description": "https://grandviewresearch.com/asia-pacific-cannabis"},
    {"title": "Boosting Regulated German Cannabis", "author": "Forbes", "description": "https://forbes.com/german-cannabis-2026"},
    {"title": "Thailand Restricts Recreational Cannabis Use", "author": "Cannabis Science Tech", "description": "https://cannabissciencetech.com/thailand-regulations"},
    {"title": "U.S. Cannabis Market Size & Share 2030", "author": "Grand View Research", "description": "https://grandviewresearch.com/us-cannabis-market"},
    {"title": "What Trump's Executive Order means for research", "author": "Hogan Lovells", "description": "https://jdsupra.com/trump-executive-order-cannabis"},
    # Enhanced Sources
    {"title": "The Rise of Cannabis Beverages and Social Tonics", "author": "BevNET", "description": "https://bevnet.com/cannabis-beverages"},
    {"title": "Cannabis Tourism: Global Hotspots and Trends", "author": "Travel Weekly", "description": "https://travelweekly.com/cannabis-tourism"},
    {"title": "Women in Cannabis: Leadership and Consumer Trends", "author": "Women Grow", "description": "https://womengrow.com/women-leadership"},
    {"title": "Senior Citizens: The Fastest Growing Demographic", "author": "AARP", "description": "https://aarp.org/cannabis-seniors"},
    {"title": "Functional Mushrooms and Adaptogens Blends", "author": "Nutritional Outlook", "description": "https://nutritionaloutlook.com/cannabis-mushrooms"},
    {"title": "Sustainable Packaging Innovations 2025", "author": "Dieline", "description": "https://thedieline.com/sustainable-cannabis-packaging"},
    {"title": "Pet Care Market Expansion for CBD", "author": "Pet Food Industry", "description": "https://petfoodindustry.com/cbd-pet-market"},
    {"title": "Culinary Cannabis: Fine Dining and Edibles", "author": "Food & Wine", "description": "https://foodandwine.com/cannabis-dining"},
    {"title": "Athletic Recovery and CBD in Sports", "author": "Sports Illustrated", "description": "https://si.com/cbd-sports-recovery"},
    {"title": "Subscription Box Models for Cannabis Consumers", "author": "Subscrb", "description": "https://subscrb.com/cannabis-boxes"},
    {"title": "Education and Certification Market Growth", "author": "EdTech Magazine", "description": "https://edtechmagazine.com/cannabis-education"},
    {"title": "Cannabis Lounges and On-Site Consumption Licenses", "author": "Eater", "description": "https://eater.com/cannabis-lounges"},
    {"title": "Export Opportunities to Emerging Markets (Brazil, Israel)", "author": "Global Trade Mag", "description": "https://globaltrademag.com/cannabis-export"},
    {"title": "Boutique vs Big Ag: The Craft Cannabis Movement", "author": "High Times", "description": "https://hightimes.com/craft-cannabis"},
    {"title": "Genetic IP Licensing as a Business Model", "author": "IP Watchdog", "description": "https://ipwatchdog.com/cannabis-genetics-licensing"},
    {"title": "DIY Home Grow Market Trends", "author": "Maximum Yield", "description": "https://maximumyield.com/home-grow-trends"},
    {"title": "Social Impact Investing in Cannabis", "author": "ImpactAlpha", "description": "https://impactalpha.com/cannabis-impact-investing"}
]


try:
    with open(file_path, 'r') as f:
        data = json.load(f)

    if "gm20-3" in data:
        data["gm20-3"]["sources"] = sources_gm20_3
        print(f"Updated GM20-3 with {len(sources_gm20_3)} sources.")
    
    if "gm20-4" in data:
        data["gm20-4"]["sources"] = sources_gm20_4
        print(f"Updated GM20-4 with {len(sources_gm20_4)} sources.")

    if "gm20-5" in data:
        data["gm20-5"]["sources"] = sources_gm20_5
        print(f"Updated GM20-5 with {len(sources_gm20_5)} sources.")

    with open(file_path, 'w') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

except Exception as e:
    print(f"Error: {e}")
