import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { GameRecommendations } from './GameRecommendations';

export const OrWhat = ({ onBack, onSelectGame, afterDark }) => {
    const { t } = useTranslation();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPrompt, setCurrentPrompt] = useState(null);
    const [winner, setWinner] = useState(null);
    const [usedIndices, setUsedIndices] = useState([]);

    const getPrompt = () => {
        let prompts = t('orwhat.prompts', { returnObjects: true });
        if (afterDark) {
            const spicy = t('orwhat.after_dark_prompts', { returnObjects: true });
            if (Array.isArray(spicy)) prompts = [...prompts, ...spicy];
        }
        const remaining = prompts.map((p, i) => ({ p, i })).filter(x => !usedIndices.includes(x.i));
        if (!remaining.length) { setUsedIndices([]); return prompts[Math.floor(Math.random() * prompts.length)]; }
        const pick = remaining[Math.floor(Math.random() * remaining.length)];
        setUsedIndices(prev => [...prev, pick.i]);
        return pick.p;
    };

    const startGame = () => { setUsedIndices([]); setCurrentPrompt(getPrompt()); setWinner(null); setIsPlaying(true); };
    const pick = (side) => { setWinner(side); if (navigator.vibrate) navigator.vibrate([100, 50, 200]); };
    const next = () => { setWinner(null); setCurrentPrompt(getPrompt()); };

    const COLOR_A = '#3B82F6';
    const COLOR_B = '#F59E0B';

    return (
        <div className="container flex-center" style={{ padding: '1rem', height: '100dvh', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', cursor: 'pointer' }}>← {t('common.back')}</button>
            </div>
            <AnimatePresence mode="wait">
                {!isPlaying ? (
                    <motion.div key="start" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex-center glass-card" style={{ flex: 1, justifyContent: 'center', borderColor: `${COLOR_B}44` }}>
                        <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>⚡</div>
                        <h2 className="title-main" style={{ fontSize: '2.8rem', background: `linear-gradient(135deg, ${COLOR_A}, ${COLOR_B})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{t('menu.game_orwhat')}</h2>
                        <div style={{ width: '100%', marginBottom: '2rem' }}>
                            {t('orwhat.rules', { returnObjects: true }).map((r, i) => (
                                <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.6rem', alignItems: 'flex-start' }}>
                                    <span style={{ minWidth: '1.5rem', height: '1.5rem', borderRadius: '50%', background: `linear-gradient(135deg, ${COLOR_A}, ${COLOR_B})`, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900, flexShrink: 0 }}>{i + 1}</span>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.4 }}>{r}</p>
                                </div>
                            ))}
                        </div>
                        <button onClick={startGame} style={{ background: `linear-gradient(135deg, ${COLOR_A}, ${COLOR_B})`, color: '#000', border: 'none', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900 }}>{t('common.start')}</button>
                        {onSelectGame && <GameRecommendations currentGame="orwhat" onSelectGame={onSelectGame} />}
                    </motion.div>
                ) : (
                    <motion.div key="play" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex-center glass-card" style={{ flex: 1, justifyContent: 'center', gap: '1rem' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '3px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>WOULD YOU RATHER</p>
                        <AnimatePresence mode="wait">
                            <motion.div key={currentPrompt?.a} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                                <motion.div whileTap={{ scale: 0.97 }} onClick={() => !winner && pick('A')} style={{ padding: '1.25rem', borderRadius: '16px', border: `2px solid ${winner === 'A' ? COLOR_A : winner === 'B' ? 'rgba(59,130,246,0.2)' : COLOR_A + '66'}`, background: winner === 'A' ? `${COLOR_A}22` : winner === 'B' ? 'rgba(255,255,255,0.02)' : `${COLOR_A}09`, cursor: winner ? 'default' : 'pointer', transition: 'all 0.3s', position: 'relative' }}>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '2px', color: COLOR_A, marginBottom: '0.4rem' }}>A</div>
                                    <p style={{ color: winner === 'B' ? 'var(--text-secondary)' : 'var(--text-primary)', fontWeight: 700, fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', margin: 0, lineHeight: 1.3 }}>{currentPrompt?.a}</p>
                                    {winner === 'A' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', color: '#EF4444', fontSize: '1.1rem' }}>🍺</motion.div>}
                                </motion.div>
                                <div style={{ textAlign: 'center', fontWeight: 900, color: 'var(--text-secondary)', fontSize: '0.9rem', fontFamily: "'Space Grotesk', sans-serif" }}>{t('orwhat.or_label')}</div>
                                <motion.div whileTap={{ scale: 0.97 }} onClick={() => !winner && pick('B')} style={{ padding: '1.25rem', borderRadius: '16px', border: `2px solid ${winner === 'B' ? COLOR_B : winner === 'A' ? 'rgba(245,158,11,0.2)' : COLOR_B + '66'}`, background: winner === 'B' ? `${COLOR_B}22` : winner === 'A' ? 'rgba(255,255,255,0.02)' : `${COLOR_B}09`, cursor: winner ? 'default' : 'pointer', transition: 'all 0.3s', position: 'relative' }}>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '2px', color: COLOR_B, marginBottom: '0.4rem' }}>B</div>
                                    <p style={{ color: winner === 'A' ? 'var(--text-secondary)' : 'var(--text-primary)', fontWeight: 700, fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', margin: 0, lineHeight: 1.3 }}>{currentPrompt?.b}</p>
                                    {winner === 'B' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', color: '#EF4444', fontSize: '1.1rem' }}>🍺</motion.div>}
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                        {winner && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', width: '100%' }}>
                                <p style={{ color: '#EF4444', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem', marginBottom: '0.75rem' }}>{t('orwhat.minority_drinks')}</p>
                                <button onClick={next} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif', width: 'auto", padding: '0.6rem 2rem' }}>{t('orwhat.next_prompt')} →</button>
                            </motion.div>
                        )}
                        {!winner && <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Tap majority side after everyone votes</p>}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
