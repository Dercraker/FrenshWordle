"use client";

import EndModal from "@/features/freePlay/EndModal";
import Rules from "@/features/freePlay/Rules";
import Motdle from "@/features/motdle/Motdle";
import useNotify from "@/hooks/useNotify";
import { getRandomWordAction } from "@/lib/server-actions/getRandomWord.action";
import {
  GameStatusSchema,
  GameStatusType,
} from "@/lib/zod/Motdle/GameStatus.schema";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

const RoutePage = () => {
  const [slug, setSlug] = useQueryState("slug");
  const { ErrorNotify } = useNotify();

  const [gameIsStarted, setGameIsStarted] = useState<boolean>(false);
  const [isEndGame, setIsEndGame] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<GameStatusType>(
    GameStatusSchema.Enum.playing,
  );

  useEffect(() => {
    (async () => {
      const slug = await getRandomWordAction();
      if (!slug) {
        return ErrorNotify({});
      }

      setSlug(slug);
    })();
  }, []);

  const handleEndGame = (status: GameStatusType) => {
    setIsEndGame(true);
    setGameStatus(status);
    console.log("🚀 ~ handleEndGame ~ setGameStatus:", setGameStatus);
  };

  const handleRestartNewGame = async () => {
    const slug = await getRandomWordAction();
    if (!slug) {
      return ErrorNotify({});
    }

    setSlug(slug);
    setIsEndGame(false);
    setGameStatus(GameStatusSchema.Enum.playing);
  };

  return (
    <>
      {!gameIsStarted || !slug ? (
        <Rules StartGame={() => setGameIsStarted(true)} gameIsReady={!slug} />
      ) : (
        <>
          <Motdle wantedWord={slug} endGame={handleEndGame} />
          <EndModal
            isGameEnd={isEndGame}
            gameStatus={gameStatus}
            restartNewGame={handleRestartNewGame}
          />
        </>
      )}
    </>
  );
};

export default RoutePage;
