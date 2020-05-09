function WatchAndCache(key: string) {
  return {
    [key]: {
      handler: (val: any) => {
        localStorage[key] = JSON.stringify(val);
      },
      deep: true,
    },
  };
}

export {
  WatchAndCache,
};
