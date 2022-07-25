export const Emojis: Record<EmojisType, string> = {
  Yes: '<:YesEmoji:820579428933042217>',
  No: '<:NoEmoji:820576440260624384>',
  Add: '<:AddEmoji:820629887701352499>',
  Remove: '<:RemoveEmoji:820629887697682449>',
  Settings: '<:SettingsEmoji:820629887886163968>',
  Warn: '<:WarnEmoji:820629887722586153>',
  Info: '<:InfoEmoji:820751342044971018>',
  Coin: '<:CoinEmoji:820629887810666517>',
  Money: '<:MoneyEmoji:820966002963120148>',
  Wrench: '<:WrenchEmoji:820966002619449346>',
  Microphone: '<:MicrophoneEmoji:893470688264990760>',
  Play: '<:PlayEmoji:893470688449540156>',
  Headphone: '<:HeadphoneEmoji:843168295174799381>',
  Music: '<:MusicEmoji:893497286334775306>',
  Discord: '<:DiscordEmoji:1001056688608116756>',
};

export const EmojisLinks: Record<EmojisType, string> = {
  Yes: 'https://cdn.discordapp.com/emojis/820579428933042217.png',
  No: 'https://cdn.discordapp.com/emojis/820576440260624384.png',
  Add: 'https://cdn.discordapp.com/emojis/820629887701352499.png',
  Remove: 'https://cdn.discordapp.com/emojis/820629887697682449.png',
  Settings: 'https://cdn.discordapp.com/emojis/820629887886163968.png',
  Warn: 'https://cdn.discordapp.com/emojis/820629887722586153.png',
  Info: 'https://cdn.discordapp.com/emojis/820751342044971018.png',
  Coin: 'https://cdn.discordapp.com/emojis/820629887810666517.png',
  Money: 'https://cdn.discordapp.com/emojis/820966002963120148.png',
  Wrench: 'https://cdn.discordapp.com/emojis/820966002619449346.png',
  Microphone: 'https://cdn.discordapp.com/emojis/893470688264990760.png',
  Play: 'https://cdn.discordapp.com/emojis/893470688449540156.png',
  Headphone: 'https://cdn.discordapp.com/emojis/843168295174799381.png',
  Music: 'https://cdn.discordapp.com/emojis/893497286334775306.png',
  Discord: 'https://cdn.discordapp.com/emojis/1001056688608116756.png',
};

type EmojisType =
  | 'Yes'
  | 'No'
  | 'Add'
  | 'Remove'
  | 'Settings'
  | 'Warn'
  | 'Info'
  | 'Coin'
  | 'Money'
  | 'Wrench'
  | 'Microphone'
  | 'Play'
  | 'Headphone'
  | 'Music'
  | 'Discord';
