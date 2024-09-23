// TODO: there are multiple instances of this, we should consolidate it, or use internal url as .envvariable
export const parseMessage = (message: any) => {
    let meta;
    try {
      meta = JSON.parse(message.meta);
    } catch (e) {
      meta = message.meta;
    }
    const msg = {
      meta: meta,
    };
    return msg;
};