import type { MenuItem, StationLoad, ScoredRecommendation } from '../api/types.ts';
import { cafeState } from './state.ts';

export function getLoadAwareRecommendations(
  menuItems: MenuItem[],
  stationLoads: StationLoad[]
): ScoredRecommendation[] {
  const loadMap = new Map<string, StationLoad>();
  stationLoads.forEach(l => loadMap.set(l.stationType, l));

  const scoredList: ScoredRecommendation[] = menuItems.map(item => {
    const stationLoad = loadMap.get(item.stationType);
    const stationWaitSeconds = stationLoad ? stationLoad.totalBacklogSeconds : 0;
    const estWaitMinutes = stationLoad ? stationLoad.estimatedWaitMinutes : 0;

    // Recommendation formula:
    // Score = BasePopularity - (StationWaitSeconds * 0.1) + (MarginWeight * 20) + ContextualBoost
    let contextualBoost = 0;
    const reasons: string[] = [];

    // Severe queue penalty if backlog > 180s (queue depth > 3)
    let queuePenalty = stationWaitSeconds * 0.1;
    if (stationWaitSeconds > 240) {
      queuePenalty *= 1.35; // Accelerate penalty during severe bottlenecks
      reasons.push(`Station under heavy load (${Math.round(stationWaitSeconds / 60)}m queue)`);
    }

    // High margin boost
    const marginBonus = item.marginWeight * 20;

    // Quick pickup perks for instant or batch pour
    if (stationWaitSeconds < 60 && item.basePrepTimeSeconds <= 45) {
      contextualBoost += 18;
      reasons.push('Lightning fast turnaround');
    }

    if (item.category === 'cold_brew' || item.stationType === 'BATCH_BREW') {
      if (stationWaitSeconds < 90) {
        contextualBoost += 12;
        reasons.push('Fast tap pour');
      }
    }

    const finalScore = Math.max(
      0,
      item.basePopularity - queuePenalty + marginBonus + contextualBoost
    );

    // Dynamic badge text
    let badgeText: string | undefined;
    const isQuickPickup = stationWaitSeconds <= 90 && item.basePrepTimeSeconds <= 45;

    if (isQuickPickup) {
      badgeText = '⚡ Ready in < 2 mins';
    } else if (stationWaitSeconds > 240) {
      badgeText = '⏳ High wait time';
    } else if (item.basePopularity >= 90) {
      badgeText = '⭐ Barista Favorite';
    }

    return {
      item,
      score: Number(finalScore.toFixed(1)),
      breakdown: {
        basePopularity: item.basePopularity,
        queuePenalty: Number(queuePenalty.toFixed(1)),
        marginBonus: Number(marginBonus.toFixed(1)),
        contextualBoost: Number(contextualBoost.toFixed(1)),
        finalScore: Number(finalScore.toFixed(1))
      },
      stationWaitSeconds,
      estimatedWaitMinutes: estWaitMinutes,
      reasons,
      badgeText,
      isQuickPickup
    };
  });

  // Sort descending by score
  return scoredList.sort((a, b) => b.score - a.score);
}

export function getQuickPickupItems(): ScoredRecommendation[] {
  const menu = cafeState.getMenu();
  const loads = cafeState.getStationLoads();
  const recommendations = getLoadAwareRecommendations(menu, loads);

  // Return top 3-4 items favoring low backlog
  return recommendations.filter(r => r.isQuickPickup || r.stationWaitSeconds < 120).slice(0, 4);
}
