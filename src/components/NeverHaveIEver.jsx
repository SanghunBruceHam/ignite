import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Share2 } from 'lucide-react';
import { ShareReceipt } from './ShareReceipt';
import { GameRecommendations } from './GameRecommendations';

export const NeverHaveIEver = ({ onBack, onSelectGame }) => {
    const { t, i18n } = useTranslation();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPrompt, setCurrentPrompt] = useState('');

    // Receipt stats tracking
    const [promptsPlayed, setPromptsPlayed] = useState(0);
    const [showReceipt, setShowReceipt] = useState(false);

    const startGame = () => {
        setIsPlaying(true);
        setPromptsPlayed(0);
        nextQuestion();
    };

    const nextQuestion = () => {
        let prompts = t('neverhave.prompts', { returnObjects: true });

        if (i18n.options.afterDark) {
            const spicyPrompts = t('neverhave.after_dark_prompts', { returnObjects: true });
            if (Array.isArray(spicyPrompts)) {
                prompts = [...prompts, ...spicyPrompts];
            }
        }

        // avoid same prompt back to back, though random is fine for now
        let randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        while (randomPrompt === currentPrompt && prompts.length > 1) {
            randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        }
        setCurrentPrompt(randomPrompt);
        setPromptsPlayed(prev => prev + 1);
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1 }
    };

    const backBtn = (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
            <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', cursor: 'pointer' }}>
                ← {t('common.back')}
            </button>
        </div>
    );

    return (
        <div className="container flex-center" style={{ padding: '1rem', height: '100dvh', flexDirection: 'column', justifyContent: 'flex-start' }}>
            {backBtn}
            <AnimatePresence mode="wait">
                {!isPlaying ? (
                    <motion.div
                        key="start"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="flex-center glass-card"
                        style={{ flex: 1, justifyContent: 'center', borderColor: 'var(--neon-blue)', boxShadow: '0 0 30px rgba(0,240,255,0.15)' }}
                    >
                        <Target size={80} color="var(--neon-blue)" style={{ filter: 'drop-shadow(0 0 20px var(--neon-blue))', marginBottom: '1rem' }} />
                        <h2 className="title-main" style={{ fontSize: '3rem', color: 'var(--neon-blue)', textShadow: '0 0 20px rgba(0,240,255,0.5)' }}>
                            {t('menu.game_never_have_i_ever')}
                        </h2>
                        <div style={{ width: '100%', marginBottom: '2rem' }}>
                            {t('neverhave.rules', { returnObjects: true }).map((step, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.6rem' }}>
                                    <span style={{ minWidth: '1.5rem', height: '1.5rem', borderRadius: '50%', background: 'var(--neon-blue)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900, flexShrink: 0 }}>{i + 1}</span>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.4 }}>{step}</p>
                                </div>
                            ))}
                        </div>
                        <button onClick={startGame} style={{ background: 'var(--neon-blue)', color: 'black', border: 'none', fontFamily: "'Space Grotesk', sans-serif" }}>
                            {t('common.start')}
                        </button>
                        {onSelectGame && <GameRecommendations currentGame="neverhave" onSelectGame={onSelectGame} />}
                    </motion.div>
                ) : (
                    <motion.div
                        key="question"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="flex-center"
                        style={{ flex: 1, width: '100%' }}
                    >
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                            <h2 style={{
                                fontSize: '3rem',
                                textAlign: 'center',
                                color: 'white',
                                fontWeight: 900,
                                textShadow: '0 0 20px rgba(0,240,255,0.3)',
                                lineHeight: 1.1,
                                fontFamily: "'Space Grotesk', sans-serif",
                                textTransform: 'uppercase'
                            }}>
                                {currentPrompt}
                            </h2>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', width: '100%', flexWrap: 'wrap' }}>
                            <button onClick={() => setShowReceipt(true)} style={{ flex: '1 1 auto', minWidth: '150px', background: 'var(--bg-charcoal)', borderColor: 'rgba(0,240,255,0.3)', color: 'var(--neon-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: "'Space Grotesk', sans-serif" }}>
                                <Share2 size={20} /> Share Result
                            </button>
                            <button
                                onClick={nextQuestion}
                                style={{ flex: '2 1 auto', minWidth: '150px', background: 'var(--neon-blue)', color: 'black', fontFamily: "'Space Grotesk', sans-serif" }}
                            >
                                {t('neverhave.next_prompt')}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Receipt Overlay */}
            <AnimatePresence>
                {showReceipt && (
                    <ShareReceipt
                        gameName={t('menu.game_never_have_i_ever')}
                        stats={[
                            { label: "PROMPTS PLAYED", value: promptsPlayed },
                            { label: "FINAL PROMPT", value: `"${currentPrompt}"` }
                        ]}
                        onClose={() => setShowReceipt(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
