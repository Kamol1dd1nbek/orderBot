export default function errorHandler<T extends { new (...args: any[]): {} }>(
  constructor: T,
  ...args: any
) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);
      const methods = Object.getOwnPropertyNames(constructor.prototype);
      methods.forEach((method) => {
        if (method !== 'constructor' && typeof this[method] === 'function') {
          const originalMethod = this[method];
          this[method] = async function (...args: any[]) {
            try {
              return await originalMethod.apply(this, args);
            } catch (error: any) {
              console.log(1);
              
              const ctx = args[0];
              ctx.telegram
                .sendMessage(
                  process.env.ADMIN_ID_1,
                  `Error occurred: ${JSON.stringify(error)}`,
                )
                .then(() => {
                  console.log(`Error reported to admin: `, error.message);
                  ctx.telegram.forwardMessage(
                    process.env.ADMIN_ID_1,
                    ctx.update.message.chat.id,
                    ctx.message.message_id,
                  );
                })
                .catch(() => {
                  console.log("Error: Can''t report to admin", error.message);
                });
            }
          };
        }
      });
    }
  };
}
