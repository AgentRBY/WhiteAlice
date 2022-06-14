import { CommandRunOptions } from '../../structures/Commands/CommonCommand';
import { SlashCommandRunOptions } from '../../structures/Commands/SlashCommand';
import { ContextCommandRunOptions } from '../../structures/Commands/ContextCommand';
import { Awaitable } from 'discord.js';

export function CommandDecorator<
  T extends
    | CommandRunOptions
    | SlashCommandRunOptions
    | ContextCommandRunOptions<'USER'>
    | ContextCommandRunOptions<'MESSAGE'>,
>(baseFunction: (args: T) => Awaitable<boolean>) {
  return function decorate(target: unknown, key: PropertyKey, descriptor: PropertyDescriptor) {
    const original = descriptor.value as (args: T) => unknown;

    descriptor.value = async function (args: T) {
      const isSuccess = await baseFunction(args);

      if (isSuccess) {
        return Reflect.apply(original, this, [args]);
      }

      return null;
    };

    return descriptor;
  };
}
