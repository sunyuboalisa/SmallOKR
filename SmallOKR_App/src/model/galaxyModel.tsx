interface Galaxy {
  Stars: Set<Star>;
}

interface Star {
  position: {x: number; y: number};
}

interface Planet extends Star {
  Satellite: Set<Satellite>;
}

interface Satellite extends Star {}

export type {Galaxy, Star, Planet, Satellite};
