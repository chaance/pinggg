export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function waitForQueryLatency(): Promise<void> {
  return wait(getRandomInt(12, 35));
}

export async function waitForNetworkLatency(): Promise<void> {
  return wait(getRandomInt(750, 2000));
}
