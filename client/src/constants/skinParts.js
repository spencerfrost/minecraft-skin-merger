export const skinRegions = {
  Head: { x: 8, y: 8, w: 8, h: 8, dx: 48, dy: 0, dw: 96, dh: 96 },
  Body: { x: 20, y: 20, w: 8, h: 12, dx: 48, dy: 96, dw: 96, dh: 144 },
  Hat: { x: 40, y: 8, w: 8, h: 8, dx: 48, dy: 0, dw: 96, dh: 96 },
  Jacket: { x: 20, y: 36, w: 8, h: 12, dx: 48, dy: 96, dw: 96, dh: 144 },
  "Left Arm": { x: 36, y: 52, w: 4, h: 12, dx: 144, dy: 96, dw: 48, dh: 144 },
  "Right Arm": { x: 44, y: 20, w: 4, h: 12, dx: 0, dy: 96, dw: 48, dh: 144 },
  "Left Leg": { x: 20, y: 52, w: 4, h: 12, dx: 96, dy: 240, dw: 48, dh: 144 },
  "Right Leg": { x: 4, y: 20, w: 4, h: 12, dx: 48, dy: 240, dw: 48, dh: 144 },
  "Left Sleeve": { x: 52,y: 52,w: 4,h: 12,dx: 144,dy: 96,dw: 48,dh: 144 },
  "Right Sleeve": { x: 44, y: 36, w: 4, h: 12, dx: 0, dy: 96, dw: 48, dh: 144 },
  "Left Pant": { x: 4, y: 52, w: 4, h: 12, dx: 96, dy: 240, dw: 48, dh: 144 },
  "Right Pant": { x: 4, y: 36, w: 4, h: 12, dx: 48, dy: 240, dw: 48, dh: 144 },
};

export const skinCoords = {
  Head: { x: 16, y: 0, w: 32, h: 32 },
  Body: { x: 16, y: 32, w: 32, h: 48 },
  Hat: { x: 16, y: 0, w: 32, h: 32 },
  Jacket: { x: 16, y: 32, w: 32, h: 48 },
  "Left Arm": { x: 48, y: 32, w: 16, h: 48 },
  "Right Arm": { x: 0, y: 32, w: 16, h: 48 },
  "Left Leg": { x: 32, y: 80, w: 16, h: 48 },
  "Right Leg": { x: 16, y: 80, w: 16, h: 48 },
  "Left Sleeve": { x: 48, y: 32, w: 16, h: 48 },
  "Right Sleeve": { x: 0, y: 32, w: 16, h: 48 },
  "Left Pant": { x: 32, y: 80, w: 16, h: 48 },
  "Right Pant": { x: 16, y: 80, w: 16, h: 48 },
};

export const skinParts = [
  "Head", "Hat", "Body", "Jacket", "Left Arm", "Left Sleeve", "Right Arm",
  "Right Sleeve", "Left Leg", "Left Pant", "Right Leg", "Right Pant"
];