import re

from bs4 import BeautifulSoup

from ebc.utils.constants import HEADERS, PATTERN_HOLDERS, PATTERN_MARKETCAP, TOTALS_URL
from ebc.utils.scraping import fetch_page


def extract_totals_data(html):
    """Extrai todos os dados da página TOTALS_URL em uma única chamada."""
    soup = BeautifulSoup(html, "html.parser")

    # 🔹 Extrair valor do EBC
    value_div = soup.find("div", id="ContentPlaceHolder1_tr_valuepertoken")
    value_span = (
        value_div.find("span", {"data-bs-toggle": "tooltip", "data-bs-html": "true"})
        if value_div
        else None
    )
    ebc_value = float(value_span.text.strip("$")) if value_span else None

    # 🔹 Extrair número de holders
    holders_div = soup.find("div", class_="d-flex flex-wrap gap-2")
    holders_match = (
        re.search(PATTERN_HOLDERS, holders_div.text) if holders_div else None
    )
    holders = int(holders_match.group(0).replace(",", "")) if holders_match else None

    # 🔹 Extrair Market Cap
    marketcap_div = soup.find("div", id="ContentPlaceHolder1_tr_marketcap")
    marketcap_text = marketcap_div.text if marketcap_div else ""
    marketcap_match = re.search(PATTERN_MARKETCAP, marketcap_text)
    marketcap = (
        float(marketcap_match.group(0).replace(",", "").strip("$"))
        if marketcap_match
        else None
    )

    return {
        "ebc_value": ebc_value,
        "holders": holders,
        "marketcap": marketcap,
    }


def get_totals_data():
    """Função principal para obter os dados do TOTALS_URL."""
    response = fetch_page(TOTALS_URL, HEADERS)
    if not response:
        raise ConnectionError("Falha ao obter a página após múltiplas tentativas.")

    try:
        return extract_totals_data(response.content)
    except Exception as e:
        print(f"Erro ao extrair dados da página TOTALS_URL: {e}")
        return None
