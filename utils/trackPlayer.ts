import TrackPlayer, {
  Event,
  Capability,
  AppKilledPlaybackBehavior,
} from "react-native-track-player";

const { Play, Pause, Stop, SeekTo, SkipToNext, SkipToPrevious } = Capability;

const setupPlayer = async (
  options: Parameters<typeof TrackPlayer.setupPlayer>[0]
) => {
  const setup = async () => {
    try {
      await TrackPlayer.setupPlayer(options);
      console.log("Player setup successful");
    } catch (error) {
      console.log("🚀 ~ setup ~ error:", error);
      return (error as Error & { code?: string }).code;
    }
  };
  while ((await setup()) === "android_cannot_setup_player_in_background") {
    // A timeout will mostly only execute when the app is in the foreground,
    // and even if we were in the background still, it will reject the promise
    // and we'll try again:
    await new Promise<void>((resolve) => setTimeout(resolve, 1));
  }
};

export const setupPlaybackService = async () => {
  await setupPlayer({ autoHandleInterruptions: true });

  await TrackPlayer.updateOptions({
    android: {
      appKilledPlaybackBehavior:
        AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
    },
    // This flag is now deprecated. Please use the above to define playback mode.
    // stoppingAppPausesPlayback: true,
    capabilities: [Play, Pause, Stop, SeekTo, SkipToNext, SkipToPrevious],
    compactCapabilities: [Play, Pause, SeekTo, SkipToNext, SkipToPrevious],
    progressUpdateEventInterval: 2,
  });
};

export const playbackService = async () => {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    const { position } = await TrackPlayer.getProgress();

    if (position > 3) {
      TrackPlayer.seekTo(0);
    } else {
      TrackPlayer.skipToPrevious();
    }
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) => {
    TrackPlayer.seekTo(position);
  });
};
