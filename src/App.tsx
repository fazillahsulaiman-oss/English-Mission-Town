import { useEffect, useMemo } from 'react';
import { MotionConfig } from 'motion/react';
import { setSfxEnabled } from './audio/sfx';
import { MISSIONS } from './content';
import { validateMissions } from './content/validate';
import { CelebrationLayer } from './effects/CelebrationLayer';
import { AdultScreen, SettingsScreen } from './screens/AdultScreens';
import { AlbumScreen } from './screens/AlbumScreen';
import { GameScreen } from './screens/GameScreen';
import { HomeScreen, MissionSelectScreen, SetupScreen, WelcomeScreen } from './screens/HomeScreens';
import { ResultsScreen } from './screens/ResultsScreen';
import { useReducedMotion } from './state/prefs';
import { activeProfile, useApp } from './state/store';

// Content is validated once at startup; broken content shows an adult-facing error instead of a broken game.
const contentReport = validateMissions(MISSIONS);

export function App() {
  const screen = useApp((s) => s.screen);
  const save = useApp((s) => s.save);
  const sound = save.settings.soundEffects;
  const reduced = useReducedMotion();
  const profile = activeProfile({ save });

  useEffect(() => setSfxEnabled(sound), [sound]);
  useEffect(() => {
    document.documentElement.classList.toggle('reduced-motion', reduced);
  }, [reduced]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  const view = useMemo(() => {
    const needsProfile = screen !== 'welcome' && screen !== 'adult' && !profile;
    if (needsProfile) return <WelcomeScreen />;
    switch (screen) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'home':
        return <HomeScreen />;
      case 'missions':
        return <MissionSelectScreen />;
      case 'setup':
        return <SetupScreen />;
      case 'game':
        return <GameScreen />;
      case 'results':
        return <ResultsScreen />;
      case 'album':
        return <AlbumScreen />;
      case 'adult':
        return <AdultScreen />;
      case 'settings':
        return <SettingsScreen />;
    }
  }, [screen, profile]);

  if (contentReport.errors.length > 0) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="font-display text-3xl font-extrabold">Content needs fixing</h1>
        <p className="mb-2">The mission content did not pass its checks. Please ask the content author to fix these items:</p>
        <ul className="list-disc pl-6 text-sm">
          {contentReport.errors.slice(0, 50).map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>
      {view}
      {!reduced && <CelebrationLayer />}
    </MotionConfig>
  );
}
