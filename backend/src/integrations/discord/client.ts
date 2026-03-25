import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import pino from 'pino';
import type { AlertRecord, DiscordConfig } from '../../core/state/types.js';
import { formatDiscordMessage } from './format.js';

const logger = pino({ name: 'discord' });

export class DiscordNotifier {
  private botClient?: Client;

  async initBot(config: DiscordConfig): Promise<void> {
    if (config.mode !== 'bot' || !config.botToken) return;
    if (this.botClient) return;

    this.botClient = new Client({ intents: [GatewayIntentBits.Guilds] });
    this.botClient.on('ready', () => logger.info('Discord bot ready'));
    this.botClient.on('interactionCreate', async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      if (interaction.commandName === 'status') await interaction.reply('Racebot is running.');
      if (interaction.commandName === 'last-alerts') await interaction.reply('Use web dashboard for detailed recent alerts.');
      if (interaction.commandName === 'watch-session') await interaction.reply('Configure watch via web dashboard settings.');
      if (interaction.commandName === 'stop-watch') await interaction.reply('Stop watch via web dashboard.');
    });
    await this.botClient.login(config.botToken);
    await this.registerCommands(config.botToken, this.botClient.user?.id);
  }

  private async registerCommands(token: string, appId?: string): Promise<void> {
    if (!appId) return;
    const commands = [
      new SlashCommandBuilder().setName('watch-session').setDescription('Start watching configured session'),
      new SlashCommandBuilder().setName('stop-watch').setDescription('Stop current session watch'),
      new SlashCommandBuilder().setName('status').setDescription('Get monitor status'),
      new SlashCommandBuilder().setName('last-alerts').setDescription('Get summary of recent alerts')
    ].map((c) => c.toJSON());

    const rest = new REST({ version: '10' }).setToken(token);
    await rest.put(Routes.applicationCommands(appId), { body: commands });
  }

  async notify(alert: AlertRecord, config: DiscordConfig): Promise<void> {
    if (config.mode === 'none') return;
    const message = formatDiscordMessage(alert, config);

    if (config.mode === 'webhook' && config.webhookUrl) {
      await fetch(config.webhookUrl, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ content: message }) });
      return;
    }

    if (config.mode === 'bot' && config.channelId) {
      await this.initBot(config);
      const channel = await this.botClient?.channels.fetch(config.channelId);
      if (channel && 'send' in channel) {
        // @ts-expect-error discord send narrowed at runtime
        await channel.send(message);
      }
    }
  }
}
