import requests
import os

# Configura i tuoi dati
GITHUB_USERNAME = "maculinx"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")  # Usa il token GitHub dalle secrets

# URL per ottenere tutte le repo dell'utente
API_REPOS_URL = f"https://api.github.com/users/{GITHUB_USERNAME}/repos"
HEADERS = {"Authorization": f"token {GITHUB_TOKEN}"}

# Ottieni la lista delle repository
repos = requests.get(API_REPOS_URL, headers=HEADERS).json()

repo_links = []

for repo in repos:
    repo_name = repo["name"]
    if(repo_name != "maculinx.github.io"):
        pages_url = f"https://{GITHUB_USERNAME}.github.io/{repo_name}/"

        # Controlla se la repository ha GitHub Pages attivo
        pages_api_url = f"https://api.github.com/repos/{GITHUB_USERNAME}/{repo_name}/pages"
        pages_response = requests.get(pages_api_url, headers=HEADERS)

        if pages_response.status_code == 200:  # Se GitHub Pages è attivo
            repo_links.append(f'<li><a href="{pages_url}">{repo_name}</a></li>')

# Genera il file index.html
html_content = f"""
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maculinx GitHub Pages</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</head>
<body>
    <h1>Indice delle Repository con GitHub Pages</h1>
    <ul>
        {''.join(repo_links)}
    </ul>
</body>
</html>
"""

# Scrive il file index.html
with open("index.html", "w") as file:
    file.write(html_content)

print("✅ Index aggiornato con solo le repository con GitHub Pages attivo!")
