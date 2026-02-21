import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { GameRecommendations } from './GameRecommendations';

export const HotSeat = ({ onBack, onSelectGame, afterDark }) => {
    const { t } = useTranslation();
    const [phase, setPhase] = useState('start'); // start | pass | play
    const [currentPrompt, setCurrentPrompt] = useState(null);
    const [drinkCount, setDrinkCount] = useState(0);
    const [usedIndices, setUsedIndices] = useState([]);
    const [flash, setFlash] = useState(null);

    const getPrompt = () => {
        let prompts = t('hotseat.prompts', { returnObjects: true });
        if (afterDark) {
            const spicy = t('hotseat.after_dark_prompts', { returnObjects: true });
            if (Array.isArray(spicy)) prompts = [...prompts, ...spicy];
        }
        const remaining = prompts.map((p, i) => ({ p, i })).filter(x => !usedIndices.includes(x.i));
        if (!remaining.length) { setUsedIndices([]); return prompts[Math.floor(Math.random() * prompts.length)]; }
        const pick = remaining[Math.floor(Math.random() * remaining.length)];
        setUsedIndices(prev => [...prev, pick.i]);
        return pick.p;
    };

    const startRound = () => { setPhase('pass'); setDrinkCount(0); setUsedIndices([]); };
    const seatReady = () => { setCurrentPrompt(getPrompt()); setPhase('play'); };
    const handleAction = (drank) => {
        if (drank) setDrinkCount(c => c + 1);
        setFlash(drank ? 'drink' : 'answer');
        setTimeout(() => { setCurrentPrompt(getPrompt()); setFlash(null); }, 350);
        if (navigator.vibrate) navigator.vibrate(drank ? [100, 50, 200] : 30);
    };

    const COLOR = '#EF4444';

    return (
        <div className="container flex-center" style={{ padding: '1rem', height: '100dvh', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', cursor: 'pointer' }}>← {t('common.back')}</button>
            </div>
            <AnimatePresence mode="wait">
                {phase === 'start' && (
                    <motion.div key="start" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex-center glass-card" style={{ flex: 1, justifyContent: 'center', borderColor: `${COLOR}44` }}>
                        <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🔥</div>
                        <h2 className="title-main" style={{ fontSize: '2.8rem', background: `linear-gradient(135deg, ${COLOR}, #ff6b35)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{t('menu.game_hotseat')}</h2>
                        <div style={{ width: '100%', marginBottom: '2rem' }}>
                            {t('hotseat.rules', { returnObjects: true }).map((r, i) => (
                                <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.6rem', alignItems: 'flex-start' }}>
                                    <span style={{ minWidth: '1.5rem', height: '1.5rem', borderRadius: '50%', background: `linear-gradient(135deg, ${COLOR}, #ff6b35)`, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900, flexShrink: 0 }}>{i + 1}</span>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.4 }}>{r}</p>
                                </div>
                            ))}
                        </div>
                        <button onClick={startRound} style={{ background: `linear-gradient(135deg, ${COLOR}, #ff6b35)`, color: '#000', border: 'none', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900 }}>{t('hotseat.start_btn')}</button>
                        {onSelectGame && <GameRecommendations currentGame="hotseat" onSelectGame={onSelectGame} />}
                    </motion.div>
                )}
                {phase === 'pass' && (
                    <motion.div key="pass" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex-center glass-card" style={{ flex: 1, justifyContent: 'center', gap: '1rem' }}>
                        <div style={{ fontSize: '4rem' }}>🔥</div>
                        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: '1.4rem', textAlign: 'center', color: 'var(--text-primary)' }}>{t('hotseat.pass_label')}</h3>
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem' }}>The person in the hot seat presses when ready</p>
                        <motion.button whileTap={{ scale: 0.93 }} onClick={seatReady} style={{ background: `linear-gradient(135deg, ${COLOR}, #ff6b35)`, color: '#000', border: 'none', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: '1.1rem', padding: '1rem 2rem' }}>I'M READY 🔥</motion.button>
                    </motion.div>
                )}
                {phase === 'play' && (
                    <motion.div key="play" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex-center glass-card" style={{ flex: 1, justifyContent: 'center', gap: '1.5rem', background: flash === 'drink' ? 'rgba(239,68,68,0.05)' : flash === 'answer' ? 'rgba(0,255,136,0.05)' : 'transparent', transition: 'background 0.3s' }}>
                        {drinkCount > 0 && <div style={{ fontSize: '0.75rem', fontWeight: 700, color: COLOR, letterSpacing: '2px', fontFamily: "'Space Grotesk', sans-serif" }}>🍺 {drinkCount} {t('hotseat.shame_label')}</div>}
                        <AnimatePresence mode="wait">
                            <motion.div key={currentPrompt} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ textAlign: 'center', width: '100%' }}>
                                <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '3px', color: COLOR, marginBottom: '1rem', textTransform: 'uppercase', fontFamily: "'Space Grotesk', sans-serif" }}>HOT SEAT 🔥</p>
                                <h2 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.3, fontFamily: "'Space Grotesk', sans-serif" }}>{currentPrompt}</h2>
                            </motion.div>
                        </AnimatePresence>
                        <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                            <motion.button whileTap={{ scale: 0.93 }} onClick={() => handleAction(false)} style={{ flex: 1, background: 'rgba(0,255,136,0.08)', border: '2px solid #00ff88', color: '#00ff88', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: '0.85rem', padding: '1rem' }}>{t('hotseat.answer_btn')}</motion.button>
                            <motion.button whileTap={{ scale: 0.93 }} onClick={() => handleAction(true)} style={{ flex: 1, background: `${COLOR}11`, border: `2px solid ${COLOR}`, color: COLOR, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: '0.85rem', padding: '1rem' }}>{t('hotseat.drink_btn')}</motion.button>
                        </div>
                        <button onClick={() => setPhase('pass')} style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', padding: '0.4rem 1.2rem', width: 'auto' }}>NEXT PLAYER →</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
