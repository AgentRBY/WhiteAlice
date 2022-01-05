import { ButtonInteraction, Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';

export const pagination = (
  message: Message,
  pages: MessageEmbed[],
  buttons: [MessageButton, MessageButton] = generateDefaultButtons(pages.length),
) => {
  const [prevButton, nextButton] = buttons;
  const pagesCount = pages.length;
  let currentPage = 1;

  const buttonsRow = new MessageActionRow().addComponents(buttons);

  const collector = message.createMessageComponentCollector({
    filter: (interaction: ButtonInteraction) =>
      interaction.customId === prevButton.customId || interaction.customId === nextButton.customId,
    idle: 120_000,
  });

  collector.on('collect', (interaction: ButtonInteraction) => {
    currentPage += interaction.customId === prevButton.customId ? -1 : 1;

    buttonsRow.components[0].setDisabled(currentPage === 1);
    buttonsRow.components[1].setDisabled(currentPage === pagesCount);

    message.edit({
      embeds: [pages[currentPage - 1]],
      components: [buttonsRow],
    });
    interaction.deferUpdate();
  });

  collector.on('end', (_, reason) => {
    if (reason === 'messageDelete') {
      return;
    }

    if (message.deleted) {
      return;
    }

    buttonsRow.components[0].setDisabled(true);
    buttonsRow.components[1].setDisabled(true);

    message.edit({
      embeds: [pages[currentPage - 1]],
      components: [buttonsRow],
    });
  });
};

export const generateDefaultButtons = (
  pages: number,
  prevButtonName: string = 'Предыдущая страница',
  nextButtonName: string = 'Следующая страница',
): [MessageButton, MessageButton] => {
  return [
    new MessageButton()
      .setCustomId('yandexImageSearch_Prev')
      .setLabel(prevButtonName)
      .setStyle('PRIMARY')
      .setDisabled(true),
    new MessageButton()
      .setCustomId('yandexImageSearch_Next')
      .setLabel(nextButtonName)
      .setStyle('PRIMARY')
      .setDisabled(pages === 1),
  ];
};
