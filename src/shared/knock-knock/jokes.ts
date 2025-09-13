export interface Joke {
  id: string;
  setup: string;
  punch: string;
}

const JOKES: Joke[] = [
  { id: 'lettuce', setup: 'Lettuce', punch: "Lettuce in—it's cold out here!" },
  { id: 'boo', setup: 'Boo', punch: "Don't cry—it's just a joke." },
  { id: 'tank', setup: 'Tank', punch: "You're welcome." },
  { id: 'cow', setup: 'Cow says', punch: 'No, a cow says mooooo!' },
  { id: 'atch', setup: 'Atch', punch: 'Bless you!' },
];

export const getJokeById = (id?: string) =>
  JOKES.find((j) => j.id === id) ??
  JOKES[Math.floor(Math.random() * JOKES.length)];
