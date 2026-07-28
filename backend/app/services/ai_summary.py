from collections import Counter


def generate_ai_summary(stats: dict) -> str:
    """
    Mock AI summary.
    Later this function can call Ollama or OpenAI using the same input.
    """

    return (
        f"A total of {stats['crime_count']} crimes were reported. "
        f"The most common crime is {stats['most_common_crime']}. "
        f"The highest activity occurs around {stats['peak_hour']}. "
        f"The overall risk level is {stats['risk_level']}. "
        "Travellers should remain alert in this area."
    )