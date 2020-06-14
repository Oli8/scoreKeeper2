import { WatchOptionsWithHandler } from 'vue';

function WatchAndCache(key: string) {
  return {
    [key]: {
      handler: (val: any) => {
        localStorage[key] = JSON.stringify(val);
      },
      deep: true,
    } as WatchOptionsWithHandler<any>,
  };
}

export {
  WatchAndCache,
};
