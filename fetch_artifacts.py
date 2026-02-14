
import json
import os
import sys
import time
from notebooklm_mcp.api_client import NotebookLMClient
from notebooklm_mcp.auth import load_cached_tokens

ARTIFACTS_FILE = "lib/artifacts.json"

def get_client():
    cached = load_cached_tokens()
    if not cached:
        print("Error: No cached tokens found.")
        sys.exit(1)
    return NotebookLMClient(cookies=cached.cookies, csrf_token=cached.csrf_token, session_id=cached.session_id)

def fetch_content():
    if not os.path.exists(ARTIFACTS_FILE):
        print(f"Error: {ARTIFACTS_FILE} not found.")
        return

    client = get_client()
    print("NotebookLM Client initialized.")

    with open(ARTIFACTS_FILE, 'r') as f:
        data = json.load(f)

    for subject_id, content in data.items():
        notebook_id = content.get("notebookId")
        if not notebook_id:
            continue
            
        print(f"\nProcessing {subject_id}...")

        # 1. Update Briefing (Informe Ejecutivo)
        if "briefing" in content and not content["briefing"].get("content"):
            print("  Fetching Briefing...")
            try:
                query = ("Actúa como un analista experto. Genera un Informe Ejecutivo estructurado en Markdown sobre el contenido de este cuaderno. "
                         "Incluye una primera línea con el subtítulo (una sola frase descriptiva corta).\n"
                         "Usa el siguiente formato:\n"
                         "Subtitle: [Frase corta y elegante]\n\n"
                         "# Informe Ejecutivo: [Título]\n\n"
                         "## 1. Resumen Global\n[Texto]\n\n"
                         "## 2. Hallazgos Principales\n[Lista de puntos]\n\n"
                         "## 3. Análisis Detallado\n[Texto]\n\n"
                         "## 4. Conclusiones y Recomendaciones\n[Texto]")
                
                response = client.query(notebook_id, query)
                if response:
                    answer = response.get("answer", "")
                    subtitle = ""
                    if "Subtitle:" in answer:
                        parts = answer.split("Subtitle:", 1)
                        if len(parts) > 1:
                            subtitle = parts[1].split("\n")[0].strip()
                            answer = parts[1].split("\n", 1)[1].strip() if "\n" in parts[1] else answer
                    
                    data[subject_id]["briefing"]["content"] = answer
                    data[subject_id]["briefing"]["subtitle"] = subtitle or "Resumen ejecutivo para directivos y tomadores de decisiones."
                    data[subject_id]["briefing"]["status"] = "completed"
                    print(f"    -> Briefing updated with subtitle: {subtitle[:30]}...")
                time.sleep(2)
            except Exception as e:
                print(f"    -> Error fetching briefing: {e}")

        # 2. Update Study Guide (Guía de Estudio)
        if "studyGuide" in content and not content["studyGuide"].get("content"):
             print("  Fetching Study Guide...")
             try:
                query = ("Actúa como un profesor universitario. Crea una Guía de Estudio estructurada en Markdown. "
                         "Incluye una primera línea con el subtítulo (una sola frase descriptiva corta).\n"
                         "Usa el siguiente formato:\n"
                         "Subtitle: [Frase corta y elegante]\n\n"
                         "# Guía de Estudio: [Título]\n\n"
                         "## Objetivos de Aprendizaje\n[Lista]\n\n"
                         "## Conceptos Clave\n[Definiciones importantes]\n\n"
                         "## Resumen del Temario\n[Explicación estructurada]\n\n"
                         "## Preguntas de Repaso\n[5 preguntas tipo test]\n\n"
                         "## Respuestas\n[Soluciones a las preguntas]")
                
                response = client.query(notebook_id, query)
                if response:
                    answer = response.get("answer", "")
                    subtitle = ""
                    if "Subtitle:" in answer:
                        parts = answer.split("Subtitle:", 1)
                        if len(parts) > 1:
                            subtitle = parts[1].split("\n")[0].strip()
                            answer = parts[1].split("\n", 1)[1].strip() if "\n" in parts[1] else answer

                    data[subject_id]["studyGuide"]["content"] = answer
                    data[subject_id]["studyGuide"]["subtitle"] = subtitle or "Guía de aprendizaje con conceptos clave y evaluación."
                    data[subject_id]["studyGuide"]["status"] = "completed"
                    print(f"    -> Study Guide updated with subtitle: {subtitle[:30]}...")
                time.sleep(2)
             except Exception as e:
                print(f"    -> Error fetching study guide: {e}")
        
        # Save after each subject to persist progress
        with open(ARTIFACTS_FILE, 'w') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

    print("\nFetch complete.")

if __name__ == "__main__":
    fetch_content()
