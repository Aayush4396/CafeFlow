from typing import List, Dict
from app.models.menu import MenuItem, StationType

def compute_load_aware_recommendations(
    menu_items: List[MenuItem],
    station_backlogs: Dict[StationType, int] # backlog in seconds
) -> List[Dict]:
    """
    Score(item) = BasePopularity - (StationWaitSeconds * 0.1) + (MarginWeight * 20) + ContextualBoost
    """
    scored = []
    for item in menu_items:
        backlog_sec = station_backlogs.get(item.station_type, 0)
        est_wait_min = round(backlog_sec / 60.0, 1)

        queue_penalty = backlog_sec * 0.1
        if backlog_sec > 240:
            queue_penalty *= 1.35

        margin_bonus = item.margin_weight * 20.0
        contextual_boost = 0.0

        if backlog_sec < 60 and item.base_prep_time_seconds <= 45:
            contextual_boost += 18.0

        if item.station_type == StationType.BATCH_BREW and backlog_sec < 90:
            contextual_boost += 12.0

        final_score = max(0.0, item.base_popularity - queue_penalty + margin_bonus + contextual_boost)

        badge_text = None
        is_quick = backlog_sec <= 90 and item.base_prep_time_seconds <= 45
        if is_quick:
            badge_text = "⚡ Ready in < 2 mins"
        elif backlog_sec > 240:
            badge_text = "⏳ High wait time"

        scored.append({
            "item": item.model_dump(),
            "score": round(final_score, 1),
            "station_wait_seconds": backlog_sec,
            "estimated_wait_minutes": est_wait_min,
            "badge_text": badge_text,
            "is_quick_pickup": is_quick
        })

    return sorted(scored, key=lambda x: x["score"], reverse=True)
