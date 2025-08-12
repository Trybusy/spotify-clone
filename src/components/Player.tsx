"use client";

import { usePlayer } from "@/context/PlayerContext";
import { motion } from "framer-motion";
import Image from "next/image";

/**
 * Player control bar fixed at bottom.
 */
export default function Player() {
  const { currentSong, isPlaying, togglePlay } = usePlayer();

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 flex items-center justify-between">
      <div className="flex items-center">
        <Image src={currentSong.cover} alt={currentSong.title} width={50} height={50} className="mr-4" />
        <div>
          <p className="font-semibold">{currentSong.title}</p>
          <p className="text-sm text-gray-400">{currentSong.artist}</p>
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className="bg-brand text-black px-4 py-2 rounded"
      >
        {isPlaying ? "Pause" : "Play"}
      </motion.button>
    </div>
  );
}
