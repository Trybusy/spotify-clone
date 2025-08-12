import ThreeVisualizer from "@/components/ThreeVisualizer";
import SongList from "@/components/SongList";

/**
 * Main page showing visualizer and list of songs.
 */
export default function Home() {
  return (
    <div className="space-y-8">
      <ThreeVisualizer />
      <SongList />
    </div>
  );
}
