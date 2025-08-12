export interface Song {
  id: number;
  title: string;
  artist: string;
  cover: string;
  audio: string;
}

export const songs: Song[] = [
  {
    id: 1,
    title: "Sample Track 1",
    artist: "Unknown Artist",
    cover:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80",
    audio:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "Sample Track 2",
    artist: "Unknown Artist",
    cover:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80",
    audio:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 3,
    title: "Sample Track 3",
    artist: "Unknown Artist",
    cover:
      "https://images.unsplash.com/photo-1501769752-a5864b3468ff?auto=format&fit=crop&w=400&q=80",
    audio:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
];
