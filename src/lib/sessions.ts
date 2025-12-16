export type SessionProfile = {
  id: string;                 // e.g. "FX_24x5"
  displayName: string;
  timezone: string;           // informational (real tz math comes later)
  openDays: number[];         // 0=Sun..6=Sat
  openHourUTC: number;        // simplistic baseline
  closeHourUTC: number;
  notes: string;
};

export const SESSION_PROFILES: SessionProfile[] = [
  { id:"FX_24x5", displayName:"Forex 24x5", timezone:"UTC", openDays:[1,2,3,4,5], openHourUTC:0, closeHourUTC:24, notes:"Market open Mon–Fri (retail conventions vary by broker)." },
  { id:"CRYPTO_24x7", displayName:"Crypto 24x7", timezone:"UTC", openDays:[0,1,2,3,4,5,6], openHourUTC:0, closeHourUTC:24, notes:"Always on." },
  { id:"US_RTH", displayName:"US Stocks RTH", timezone:"America/New_York", openDays:[1,2,3,4,5], openHourUTC:14, closeHourUTC:21, notes:"RTH baseline. Add ETH later." },
];

export function getProfile(id: string) {
  return SESSION_PROFILES.find(p => p.id === id) ?? SESSION_PROFILES[0];
}
