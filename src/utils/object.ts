export const objectMap = <T>(src: object, p: string) => {
  return Object.entries(src).reduce((r, [name, val]) => ({ ...r, [name]: val["reducers"] }), {} as T);
};
