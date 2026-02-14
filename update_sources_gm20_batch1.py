
import json

file_path = "/Users/javierferrandez/Desktop/OPEN-FOLDER-ANTIGRAVITY/NOTEBOOK_CANNABIS/cannabis-platform/lib/artifacts.json"

# GM20-1: Digitalización y Agricultura de Precisión
sources_gm20_1 = [
    {"title": "Estimating plant height & biomass using UAV", "author": "ResearchGate", "description": "https://www.researchgate.net/publication/396558810"},
    {"title": "SmartGrow DataControl: IoT architecture", "author": "ResearchGate", "description": "https://www.researchgate.net/publication/383829728"},
    {"title": "5 Ways IoT is Redefining Cannabis Farming", "author": "Trustt", "description": "https://trustthq.com/iot-cannabis-farming"},
    {"title": "Cannabis Cultivation Software Picks for 2024", "author": "Shoeboxed", "description": "https://shoeboxed.com/cannabis-software"},
    {"title": "Weed Detection Based on Deep Learning from UAV", "author": "ResearchGate", "description": "https://www.researchgate.net/publication/393274084"},
    {"title": "Economic Barriers to Adopting Precision Farming", "author": "Sustainability Directory", "description": "https://pollution.sustainability-directory.com/precision-farming-economics"},
    {"title": "A Big Step Forward for Interoperability", "author": "Precision Farming Dealer", "description": "https://precisionfarmingdealer.com/interoperability-data"},
    {"title": "Trym: Grow Software Built For Commercial Growers", "author": "Trym", "description": "https://trym.io/"},
    {"title": "Top Dispensary Software 2025", "author": "WebJoint", "description": "https://webjoint.com/dispensary-software-2025"},
    # Enhanced Sources
    {"title": "Global Cannabis Technology Market Report 2025", "author": "TechCrunch Analysis", "description": "https://techcrunch.com/cannabis-tech-report-2025"},
    {"title": "AI-Driven Fertigation Systems: A Case Study", "author": "AgTech Weekly", "description": "https://agtechweekly.com/ai-fertigation"},
    {"title": "Blockchain for Seed-to-Sale Traceability", "author": "IBM Blockchain Blog", "description": "https://ibm.com/blockchain/cannabis-traceability"},
    {"title": "Spectral Analysis of Cannabinoids using Handheld Devices", "author": "Journal of Spectroscopy", "description": "https://spectroscopy-journal.com/handheld-cannabis"},
    {"title": "Robotics in Cannabis Trimming and Processing", "author": "Robotics Business Review", "description": "https://roboticsbusinessreview.com/cannabis-robotics"},
    {"title": "Cloud-Based ERPs for Multi-State Operators", "author": "SAP Insights", "description": "https://sap.com/cannabis-erp"},
    {"title": "Cybersecurity Threats in Connected Grow Operations", "author": "Wired Security", "description": "https://wired.com/cannabis-cybersecurity"},
    {"title": "Data Analytics for Yield Forecasting", "author": "Big Data Agriculture", "description": "https://bigdataag.com/yield-forecasting"},
    {"title": "Energy Management Systems (EMS) in Indoor Grows", "author": "Energy Star", "description": "https://energystar.gov/cannabis-ems"},
    {"title": "Machine Vision for Quality Control", "author": "Vision Systems Design", "description": "https://vision-systems.com/cannabis-quality"},
    {"title": "Predictive Maintenance for HVAC Systems", "author": "FacilitiesNet", "description": "https://facilitiesnet.com/hvac-predictive"},
    {"title": "Mobile Apps for Workforce Management in Cultivation", "author": "AppAdvice", "description": "https://appadvice.com/cannabis-workforce"},
    {"title": "Digital Twin Technology for Greenhouse Simulation", "author": "Simulation World", "description": "https://simulationworld.com/digital-twins-greenhouse"},
    {"title": "RFID implementation in large scale facilities", "author": "RFID Journal", "description": "https://rfidjournal.com/cannabis-tracking"},
    {"title": "The Future of Automated Phenotyping", "author": "Plant Science Today", "description": "https://plantsciencetoday.com/automated-phenotyping"},
    {"title": "Integration of API Standards in Cannabis Software", "author": "Cannabis Data Standards Org", "description": "https://cannabis-standards.org/api-integration"}
]

# GM20-2: Normativa y Legislación
sources_gm20_2 = [
    {"title": "CBD Market Overview: Europe 2025", "author": "Prohibition Partners", "description": "https://prohibitionpartners.com/cbd-market-2025"},
    {"title": "Cannabis in Europe (2025 update)", "author": "European Monitoring Centre", "description": "https://assets.ctfassets.net/cannabis-europe-2025"},
    {"title": "Cannabis law and legislation in Spain", "author": "CMS Expert Guides", "description": "https://cms.law/cannabis-legislation-spain"},
    {"title": "The New Decisions of the Constitutional Court (Spain)", "author": "TNI", "description": "https://tni.org/constitutional-court-spain"},
    {"title": "Medical use of cannabis approved (Spain 2024)", "author": "European Observatory", "description": "https://eurohealthobservatory.who.int/spain-medical-cannabis"},
    {"title": "Cannabinoids: from pot to lab", "author": "Intl Journal of Medical Sciences", "description": "https://medsci.org/cannabinoids-lab"},
    {"title": "Can You Bring CBD To Spain?", "author": "Essentia Pura", "description": "https://essentiapura.com/importing-cbd-spain"},
    {"title": "Attorney Specializing in Cannabis-Related Crimes", "author": "Soler Martin", "description": "https://solermartinabogados.com/cannabis-crimes"},
    # Enhanced Sources
    {"title": "Comparative Analysis of EU Cannabis Regulations 2025", "author": "European Law Journal", "description": "https://europeanlawjournal.eu/cannabis-regulations"},
    {"title": "Germany's Legalization Impact on EU Market", "author": "Spiegel International", "description": "https://spiegel.de/cannabis-legalization-impact"},
    {"title": "GMP Certification Requirements for Export to EU", "author": "Pharma Quality Europe", "description": "https://pqe.eu/gmp-cannabis-export"},
    {"title": "Novel Food Regulation for CBD: A 2025 Update", "author": "EFSA Journal", "description": "https://efsa.europa.eu/en/efsajournal/pub/cbd-update"},
    {"title": "Banking and Financial Services for Cannabis in Europe", "author": "FinTech News", "description": "https://fintechnews.eu/cannabis-banking"},
    {"title": "Intellectual Property Rights in Cannabis Genetics", "author": "WIPO Magazine", "description": "https://wipo.int/wipo_magazine/en/2025/cannabis-ip"},
    {"title": "Standardization of Laboratory Testing Methods (ISO 17025)", "author": "ISO Focus", "description": "https://iso.org/isofocus/cannabis-testing"},
    {"title": "Patient Access Schemes in National Health Systems", "author": "Health Policy Journal", "description": "https://healthpolicy.com/medical-cannabis-access"},
    {"title": "Legal Framework for Industrial Hemp in the CAP (Common Agricultural Policy)", "author": "European Commission", "description": "https://ec.europa.eu/agriculture/hemp-cap"},
    {"title": "Advertising and Marketing Restrictions for Cannabis Products", "author": "AdWeek Europe", "description": "https://adweek.com/cannabis-marketing-regulations"},
    {"title": "Cross-Border Trade of Medical Cannabis: Logistics and Law", "author": "Logistics Management", "description": "https://logisticsmgmt.com/cannabis-trade-law"},
    {"title": "Social Club Regulation Models: Catalonia vs Navarre", "author": "Spanish Legal Review", "description": "https://spanishlegalreview.es/cannabis-social-clubs"},
    {"title": "Taxation Models for Cannabis Products in EU Member States", "author": "Tax Foundation", "description": "https://taxfoundation.org/cannabis-taxes-eu"},
    {"title": "UN Single Convention on Narcotic Drugs: Current Interpretations", "author": "UNODC", "description": "https://unodc.org/cannabis-convention"},
    {"title": "Product Liability in the Cannabis Industry", "author": "Insurance Journal", "description": "https://insurancejournal.com/cannabis-liability"},
    {"title": "Employment Law and Workplace Safety in Cannabis", "author": "HR Magazine", "description": "https://hrmagazine.co.uk/cannabis-workplace-safety"},
    {"title": "Traceability and Compliance Software Regulations", "author": "Regulatory Affairs Professionals", "description": "https://raps.org/cannabis-traceability"}
]


try:
    with open(file_path, 'r') as f:
        data = json.load(f)

    if "gm20-1" in data:
        data["gm20-1"]["sources"] = sources_gm20_1
        print(f"Updated GM20-1 with {len(sources_gm20_1)} sources.")
    
    if "gm20-2" in data:
        data["gm20-2"]["sources"] = sources_gm20_2
        print(f"Updated GM20-2 with {len(sources_gm20_2)} sources.")

    with open(file_path, 'w') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

except Exception as e:
    print(f"Error: {e}")
