export default interface GameButton {
  label: string,
  callback(): void,
  disabled(): boolean,
  icon?: string
}
