import type { AlertRecord, DiscordConfig } from '../../core/state/types.js';

export function formatDiscordMessage(alert: AlertRecord, discord: DiscordConfig): string {
  const roleTag = discord.teamRoleId ? `<@&${discord.teamRoleId}> ` : '';
  return `${roleTag}ALERT: Car #${alert.competitor.carNumber} (${alert.competitor.driverName}) in ${alert.competitor.className} ahead of us has ${alert.type === 'meatball' ? 'received a meatball flag' : 'an unusually long pit stop'}.\nCompetitor P${alert.competitor.position} | Our P${alert.myCar.position} | Session: ${alert.sessionName}\nTime: ${alert.ts} | Confidence: ${alert.confidence} | Reason: ${alert.reason}`;
}
