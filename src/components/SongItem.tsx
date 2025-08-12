"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Song } from "@/data/songs";
import { usePlayer } from "@/context/PlayerContext";

interface Props {
  song: Song;
}

/**
 * Renders a single song line with cover and title.
 * Clicking a song will trigger playback through context.
 */
export default function SongItem({ song }: Props) {
  const { playSong } = usePlayer();

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      className="flex items-center w-full text-left p-2 rounded hover:bg-gray-800"
      onClick={() => playSong(song)}
    >
      <Image src={song.cover} alt={song.title} width={40} height={40} className="mr-4" />
      <div>
        <p className="font-semibold">{song.title}</p>
        <p className="text-sm text-gray-400">{song.artist}</p>
      </div>
    </motion.button>
  );
}
