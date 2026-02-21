import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { GameRecommendations } from './GameRecommendations';

export const MostWanted = ({ onBack, onSelectGame, afterDark }) => {
    const { t } = useTranslation();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPrompt, setCurrentPrompt] = useState(null);
    const [usedIndices, setUsedIndices] = useState([]);
    const [pointing, setPointing] = useState(false);

    const getPrompt = () => {
        let prompts = t('mostwanted.prompts', { returnObjects: true });
        if (afterDark) {
            const spicy = t('mostwanted.after_dark_prompts', { returnObjects: true });
            if (Array.isArray(spicy)) prompts = [...prompts, ...spicy];
        }
        const remaining = prompts.map((p, i) => ({ p, i })).filter(x => !usedIndices.includes(x.i));
        if (!remaining.length) { setUsedIndices([]); return prompts[Math.floor(Math.random() * prompts.length)]; }
        const pick = remaining[Math.floor(Math.random() * remaining.length)];
        setUsedIndices(prev => [...prev, pick.i]);
        return pick.p;
    };

    const startGame = () => { setUsedIndices([]); setCurrentPrompt(getPrompt()); setPointing(false); setIsPlaying(true); };
    const reveal = () => { setPointing(true); if (navigator.vibrate) navigator.vibrate([200, 100, 200]); };
    const next = () => { setPointing(false); setCurrentPrompt(getPrompt()); };

    const COLOR = '#A855F7';

    return (
        <div className="container flex-center" style={{ padding: '1rem', height: '100dvh', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', cursor: 'pointer' }}>← {t('common.back')}</button>
            </div>
            <AnimatePresence mode="wait">
                {!isPlaying ? (
                    <motion.div key="start" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex-center glass-card" style={{ flex: 1, justifyContent: 'center', borderColor: `${COLOR}44` }}>
                        <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🎯</div>
                        <h2 className="title-main" style={{ fontSize: '2.8rem', background: `linear-gradient(135deg, ${COLOR}, #d946ef)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{t('menu.game_mostwanted')}</h2>
                        <div style={{ width: '100%', marginBottom: '2rem' }}>
                            {t('mostwanted.rules', { returnObjects: true }).map((r, i) => (
                                <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.6rem', alignItems: 'flex-start' }}>
                                    <span style={{ minWidth: '1.5rem', height: '1.5rem', borderRadius: '50%', background: `linear-gradient(135deg, ${COLOR}, #d946ef)`, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900, flexShrink: 0 }}>{i + 1}</span>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.4 }}>{r}</p>
                                </div>
                            ))}
                        </div>
                        <button onClick={startGame} style={{ background: `linear-gradient(135deg, ${COLOR}, #d946ef)`, color: '#000', border: 'none', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900 }}>{t('common.start')}</button>
                        {onSelectGame && <GameRecommendations currentGame="mostwanted" onSelectGame={onSelectGame} />}
                    </motion.div>
                ) : (
                    <motion.div key="play" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex-center glass-card" style={{ flex: 1, justifyContent: 'center', gap: '1.5rem' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '3px', color: COLOR, textTransform: 'uppercase', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>{t('mostwanted.point_label')}</p>
                        <AnimatePresence mode="wait">
                            <motion.h2 key={currentPrompt} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ fontSize: 'clamp(1.3rem, 4.5vw, 2rem)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.3, textAlign: 'center', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>
                                {currentPrompt}
                            </motion.h2>
                        </AnimatePresence>
                        <AnimatePresence>
                            {pointing && (
                                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '1rem', borderRadius: '12px', background: `${COLOR}22`, border: `2px solid ${COLOR}`, width: '100%' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>👆👆👆</div>
                                    <p style={{ color: COLOR, fontWeight: 900, fontFamily: "'Space Grotesk', sans-serif", margin: 0, fontSize: '0.9rem' }}>MOST FINGERS = DRINKS! 🍺</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {!pointing ? (
                            <button onClick={reveal} style={{ background: `linear-gradient(135deg, ${COLOR}, #d946ef)`, color: '#000', border: 'none', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900 }}>POINT! 👆</button>
                        ) : (
                            <button onClick={next} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>{t('mostwanted.next_prompt')}</button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
