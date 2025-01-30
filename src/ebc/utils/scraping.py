import requests


def fetch_page(url, headers, retries=3):
    """Tenta buscar a página com retries."""
    for _ in range(retries):
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response
    return None
