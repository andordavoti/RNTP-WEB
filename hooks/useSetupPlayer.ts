import TrackPlayer, { Track } from "react-native-track-player";
import { useEffect, useState } from "react";
import { setupPlaybackService } from "../utils/trackPlayer";
import playlistData from "../lib/playlist.json";

export const useSetupPlayer = () => {
  const [playerReady, setPlayerReady] = useState<boolean>(false);

  useEffect(() => {
    let unmounted = false;

    async function run () {
      await setupPlaybackService();
      if (unmounted) return;
      setPlayerReady(true);
      const queue = await TrackPlayer.getQueue();
      if (unmounted) return;
      if (queue.length <= 0) {
        await TrackPlayer.add(playlistData as Track[]);
      }
    }

    run()
      .then(() => {
        alert('>>>>>>>>>>>>> Working! <<<<<<<<<<<<<');
      })
      .catch(err => {
        console.error(err);
        alert('>>>>>>>>>>>>> Broken! <<<<<<<<<<<<<');
      });

    return () => {
      unmounted = true;
    };
  }, []);

  return playerReady;
};
