export default interface GameButton {
  label: string,
  callback(arg?: any): void,
  disabled(): boolean,
  icon?: string
}
