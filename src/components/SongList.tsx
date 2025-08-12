import { songs } from "@/data/songs";
import SongItem from "./SongItem";

/**
 * Displays a list of available songs.
 */
export default function SongList() {
  return (
    <div className="space-y-2">
      {songs.map((song) => (
        <SongItem key={song.id} song={song} />
      ))}
    </div>
  );
}
