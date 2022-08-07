import { SlashCommand, SlashCommandRunOptions } from '../../../structures/Commands/SlashCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageActionRow, MessageSelectMenu, TextChannel } from 'discord.js';
import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';
import { RoleSelect } from '../../../typings/Interactions';
import emojiRegex from 'emoji-regex';

class RoleSelectCommand extends SlashCommand {
  meta = new SlashCommandBuilder()
    .setName('role')
    .setDescription('Взаимодействие с ролями')
    .addSubcommandGroup((option) =>
      option
        .setName('message')
        .setDescription('Взаимодействие с сообщениями с компонентом выбора роли')
        .addSubcommand((option) =>
          option
            .setName('create')
            .setDescription('Добавить на сообщение компонент выбора роли')
            .addChannelOption(
              (option) =>
                option
                  .setName('канал')
                  .setDescription('Канал, в который будет отправлено сообщение')
                  .setRequired(true)
                  .addChannelTypes(0), //Text Channel
            )
            .addStringOption((option) =>
              option
                .setName('сообщение')
                .setDescription('Айди сообщения, которое будет скопировано для контента')
                .setRequired(true),
            )
            .addBooleanOption((option) =>
              option.setName('мультивыбор').setDescription('Дать возможность пользователю выбирать несколько ролей'),
            )
            .addStringOption((option) =>
              option.setName('плейсхолдер').setDescription('Плейсхолдер для компонента выбора роли'),
            ),
        )
        .addSubcommand((option) =>
          option
            .setName('edit')
            .setDescription('Редактировать уже существующее сообщение с компонентом выбора роли')
            .addStringOption((option) =>
              option
                .setName('сообщение')
                .setDescription('Айди сообщения, которое будет скопировано для контента')
                .setRequired(true),
            )
            .addBooleanOption((option) =>
              option
                .setName('мультивыбор')
                .setDescription('Дать возможность' + ' пользователю выбирать несколько ролей')
                .setRequired(false),
            )
            .addStringOption((option) =>
              option
                .setName('плейсхолдер')
                .setDescription('Плейсхолдер для компонента' + ' выбора роли')
                .setRequired(false),
            ),
        ),
    )
    .addSubcommand((option) =>
      option
        .setName('add')
        .setDescription('Добавить роль в компонент выбора роли')
        .addStringOption((option) => option.setName('сообщение').setDescription('Айди сообщения').setRequired(true))
        .addRoleOption((option) =>
          option.setName('роль').setDescription('Роль, которую нужно добавить').setRequired(true),
        )
        .addStringOption((option) =>
          option.setName('имя').setDescription('Отображаемое имя для компонента выбора роли').setRequired(true),
        )
        .addStringOption((option) =>
          option.setName('эмодзи').setDescription('Эмодзи для компонента выбора роли').setRequired(true),
        )
        .addStringOption((option) =>
          option.setName('описание').setDescription('Описание для компонента выбора роли').setRequired(false),
        ),
    )
    .addSubcommand((option) =>
      option
        .setName('remove')
        .setDescription('Удалить роль из компонента выбора роли')
        .addStringOption((option) => option.setName('сообщение').setDescription('Айди сообщения').setRequired(true))
        .addRoleOption((option) =>
          option.setName('роль').setDescription('Роль, которую нужно удалить').setRequired(true),
        ),
    );

  async run(options: SlashCommandRunOptions) {
    if (!options.interaction.member.permissions.has('ADMINISTRATOR')) {
      const embed = ErrorEmbed('Недостаточно прав');
      return options.interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const subcommand = options.interaction.options.getSubcommand();
    switch (subcommand) {
      case 'add':
        return this.runAdd(options);
      case 'remove':
        return this.runRemove(options);
      case 'create':
        return this.runMessageCreate(options);
      case 'edit':
        return this.runMessageEdit(options);
    }
  }

  // /role message create
  private async runMessageCreate({ interaction }: SlashCommandRunOptions) {
    const messageId = interaction.options.getString('сообщение', true);
    const message = await interaction.channel.messages.fetch(messageId).catch(() => {});

    if (!message) {
      const embed = ErrorEmbed('Сообщение не найдено');
      embed.setFooter({ text: 'Подсказка: сообщение должно быть в том же канале, где выполняется команда' });
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const channel = interaction.options.getChannel('канал', true) as TextChannel;
    const placeholder = interaction.options.getString('плейсхолдер');
    const multichoise = interaction.options.getBoolean('мультивыбор');

    const select = new MessageSelectMenu()
      .setCustomId(`${RoleSelect.SelectRole}_${multichoise ? 'multiselect' : 'singleselect'}`)
      .setPlaceholder(placeholder || 'Выбирите роль')
      .setMinValues(0)
      .addOptions([
        {
          value: 'default',
          label: 'Что бы добавить роль выполните /role add',
        },
      ]);

    if (!multichoise) {
      select.setMaxValues(1);
    }
    const row = new MessageActionRow().addComponents(select);

    await channel.send({
      ...(message.content ? { content: message.content } : {}),
      embeds: message.embeds,
      files: [...message.attachments.values()],
      components: [row],
    });

    const embed = SuccessEmbed('Сообщение создано');
    interaction.reply({ embeds: [embed], ephemeral: true });
  }

  // /role add
  private async runAdd({ interaction }: SlashCommandRunOptions) {
    const messageId = interaction.options.getString('сообщение', true);
    const message = await interaction.channel.messages.fetch(messageId);

    if (!message) {
      const embed = ErrorEmbed('Сообщение не найдено');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (!message.components[0]?.components[0]?.customId.startsWith(RoleSelect.SelectRole)) {
      const embed = ErrorEmbed('Сообщение не является компонентом выбора ролей');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const role = interaction.options.getRole('роль', true);
    const name = interaction.options.getString('имя', true);
    const emoji = interaction.options.getString('эмодзи', true).trim();
    const description = interaction.options.getString('описание');
    const isMultiselect = message.components[0].components[0].customId.includes('multiselect');

    const isUnicodeEmoji = emojiRegex().test(emoji);
    const emojiId = emoji.split(':')[2]?.slice(0, -1);

    if (!isUnicodeEmoji && (!emojiId || !interaction.client.emojis.resolve(emojiId))) {
      const embed = ErrorEmbed('Эмодзи не найдено');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const select = message.components[0].components[0] as MessageSelectMenu;

    const isFirstOption = select.options[0].value === 'default';

    if (isFirstOption) {
      select.setOptions([]);
    }

    select
      .addOptions({
        value: role.id,
        label: name,
        emoji,
        description,
      })
      .setMinValues(0);

    if (isMultiselect) {
      select.setMaxValues(select.options.length);
    }

    message.edit({
      embeds: message.embeds,
      ...(message.content ? { content: message.content } : {}),
      files: [...message.attachments.values()],
      components: [new MessageActionRow().addComponents(select)],
    });

    const embed = SuccessEmbed(`Роль ${role} добавлена`);
    interaction.reply({ embeds: [embed], ephemeral: true });
  }

  // /role remove
  private async runRemove({ interaction }: SlashCommandRunOptions) {
    const messageId = interaction.options.getString('сообщение', true);
    const message = await interaction.channel.messages.fetch(messageId);

    if (!message) {
      const embed = ErrorEmbed('Сообщение не найдено');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (!message.components[0]?.components[0]?.customId.startsWith(RoleSelect.SelectRole)) {
      const embed = ErrorEmbed('Сообщение не является компонентом выбора ролей');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const role = interaction.options.getRole('роль', true);
    const isMultiselect = message.components[0].components[0].customId.includes('multiselect');

    const select = message.components[0].components[0] as MessageSelectMenu;

    if (select.options.length === 1) {
      const embed = ErrorEmbed('Это последняя роль в компоненте, её нельзя удалить');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (!select.options.some((option) => option.value === role.id)) {
      const embed = ErrorEmbed('Эта роль не найдена в компоненте');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    select.spliceOptions(
      select.options.findIndex((option) => option.value === role.id),
      1,
    );

    if (isMultiselect) {
      select.setMaxValues(select.options.length);
    }

    message.edit({
      embeds: message.embeds,
      ...(message.content ? { content: message.content } : {}),
      files: [...message.attachments.values()],
      components: [new MessageActionRow().addComponents(select)],
    });

    const embed = SuccessEmbed(`Роль ${role} удалена`);
    interaction.reply({ embeds: [embed], ephemeral: true });
  }

  // /role message edit
  private async runMessageEdit({ interaction }: SlashCommandRunOptions) {
    const messageId = interaction.options.getString('сообщение', true);
    const message = await interaction.channel.messages.fetch(messageId).catch(() => {});

    if (!message) {
      const embed = ErrorEmbed('Сообщение не найдено');
      embed.setFooter({ text: 'Подсказка: сообщение должно быть в том же канале, где выполняется команда' });
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const select = message.components[0]?.components.find((component) =>
      component.customId.startsWith(RoleSelect.SelectRole),
    ) as MessageSelectMenu;

    if (!select) {
      const embed = ErrorEmbed('В сообщении нет компонента выбора роли');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const placeholder = interaction.options.getString('плейсхолдер');
    const multichoise = interaction.options.getBoolean('мультивыбор');

    if (!placeholder && multichoise === null) {
      const embed = ErrorEmbed('Укажите плейсхолдер или режим мультивыбора');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (multichoise !== null) {
      select.setMaxValues(multichoise ? select.options.length : 1);
    }

    if (placeholder) {
      select.setPlaceholder(placeholder);
    }

    const row = new MessageActionRow().addComponents(select);

    await message.edit({
      ...(message.content ? { content: message.content } : {}),
      embeds: message.embeds,
      files: [...message.attachments.values()],
      components: [row],
    });

    let response = 'Компонент выбора ролей изменен:';

    if (multichoise !== null) {
      response += multichoise ? '\nМульивыбор добавлен' : '\nМульивыбор удалён';
    }

    if (placeholder) {
      response += `\nПлейсхолдер изменён на ${placeholder}`;
    }

    const embed = SuccessEmbed(response);
    interaction.reply({ embeds: [embed], ephemeral: true });
  }
}

export default new RoleSelectCommand();
