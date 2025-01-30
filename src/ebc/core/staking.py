import re

from bs4 import BeautifulSoup

from ebc.utils.constants import (
    HEADERS,
    PATTERN_CURRENT_STAKING_DOLLARS,
    PATTERN_EBC_STAKING,
    STAKING_URL,
)
from ebc.utils.scraping import fetch_page


def extract_staking_data(html):
    soup = BeautifulSoup(html, "html.parser")

    # 🔹 Extrair valor em dólares do staking
    button = soup.find("button", {"id": "dropdownMenuBalance"})
    text = button.text if button else ""
    staking_dollars_match = re.search(PATTERN_CURRENT_STAKING_DOLLARS, text)
    staking_dollars = (
        float(staking_dollars_match.group(0).strip("$").replace(",", ""))
        if staking_dollars_match
        else None
    )

    # 🔹 Extrair quantidade de EBC em staking
    staking_span = soup.find("span", class_="text-muted", string=re.compile(r"EBC"))
    staking_match = (
        re.search(PATTERN_EBC_STAKING, staking_span.text) if staking_span else None
    )
    staking_ebc = (
        float(staking_match.group(0).replace(",", "")) if staking_match else None
    )

    return {
        "staking_dollars": staking_dollars,
        "staking_ebc": staking_ebc,
    }


def get_staking_data():
    """Função principal para obter os dados de staking."""
    response = fetch_page(STAKING_URL, HEADERS)
    if not response:
        raise ConnectionError("Falha ao obter a página após múltiplas tentativas.")

    try:
        return extract_staking_data(response.content)
    except Exception as e:
        print(f"Erro ao extrair dados da página STAKING_URL: {e}")
        return None
