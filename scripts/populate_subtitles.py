
import json
import os

ARTIFACTS_FILE = "lib/artifacts.json"

def populate_subtitles():
    if not os.path.exists(ARTIFACTS_FILE):
        print(f"Error: {ARTIFACTS_FILE} not found.")
        return

    with open(ARTIFACTS_FILE, 'r') as f:
        data = json.load(f)

    # Sample subtitles for gm21-1
    for subject_id, s in data.items():
        # Specific overrides for gm21-1
        if subject_id == "gm21-1":
             if "briefing" in s:
                s["briefing"]["subtitle"] = "Visión estratégica de la bioeconomía global del cannabis y su impacto industrial."
             if "studyGuide" in s:
                s["studyGuide"]["subtitle"] = "Conceptos fundamentales sobre la cadena de valor y el marco regulatorio internacional."
             
             if "slideDecks" in s:
                subtitles = [
                    "Directrices estratégicas para la bioeconomía del cannabis global.",
                    "Estandarización y protocolos técnicos de la industria para 2026.",
                    "Análisis del realineamiento competitivo en el mercado mundial.",
                    "Estrategia nacional de clima basada en el cáñamo industrial."
                ]
                for i, slides in enumerate(s["slideDecks"]):
                    if i < len(subtitles):
                        slides["subtitle"] = subtitles[i]

             if "videos" in s:
                for video in s["videos"]:
                    if "Irlanda" in video.get("title", ""):
                        video["subtitle"] = "Estudio de caso: El éxito de la economía circular del cáñamo en Irlanda."

        elif subject_id == "gm21-2":
             if "slideDecks" in s:
                # Map by title or index if titles are consistent
                for slides in s["slideDecks"]:
                    title = slides.get("title", "").lower()
                    if "ingeniería" in title:
                        slides["subtitle"] = "Diseño de instalaciones y control ambiental."
                    elif "precision" in title:
                        slides["subtitle"] = "Optimización del cultivo basada en datos."

        elif subject_id == "gm21-3":
             if "slideDecks" in s:
                for slides in s["slideDecks"]:
                    title = slides.get("title", "").lower()
                    if "regenerative" in title and "cultivation" in title: # English title
                        slides["subtitle"] = "Prácticas sostenibles y regeneración de suelos."
                    elif "exterior" in title: # Spanish title
                        slides["subtitle"] = "Técnicas de cultivo al aire libre y sostenibilidad."

        # General defaults for all subjects
        if "briefing" in s and not s["briefing"].get("subtitle"):
             s["briefing"]["subtitle"] = "Resumen ejecutivo para directivos y tomadores de decisiones."
        
        if "studyGuide" in s and not s["studyGuide"].get("subtitle"):
             s["studyGuide"]["subtitle"] = "Guía de aprendizaje con conceptos clave y evaluación."

        if "slideDecks" in s:
            for slides in s["slideDecks"]:
                if not slides.get("subtitle"):
                     slides["subtitle"] = "Presentación detallada sobre los conceptos del módulo."

        if "videos" in s:
            for video in s["videos"]:
                if not video.get("subtitle"):
                    video["subtitle"] = "Resumen audiovisual de la lección."

    with open(ARTIFACTS_FILE, 'w') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    
    print("Subtitles populated successfully.")

if __name__ == "__main__":
    populate_subtitles()
