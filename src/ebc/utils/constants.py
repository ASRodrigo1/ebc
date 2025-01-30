PATTERN_CURRENT_STAKING_DOLLARS = r"\$\d{1,3}(,\d{3})*(\.\d{2})?"
PATTERN_EBC_STAKING = r"\d{1,3}(,\d{3})*(\.\d+)?(?=\sEBC)"
PATTERN_HOLDERS = r"\d{1,3}(,\d{3})*"
PATTERN_EBC_VALUE = r"\$\d+(\.\d{1,4})?"
PATTERN_MARKETCAP = r"\$\d{1,3}(,\d{3})*(\.\d{2})?"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    + "(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}
STAKING_URL = (
    "https://polygonscan.com/address/0xDEb03f15098921989Bd554395a4E6745Fc2755E4"
)
TOTALS_URL = "https://polygonscan.com/token/0x3f7ca3e85305aed836636999d054519f6ccc4056"
