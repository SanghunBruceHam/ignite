import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Dices, Share2 } from 'lucide-react';
import { ShareReceipt } from './ShareReceipt';

export const VibeVote = ({ onBack }) => {
    const { t, i18n } = useTranslation();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPrompt, setCurrentPrompt] = useState('');
    const [showSpinner, setShowSpinner] = useState(false);
    const [consequence, setConsequence] = useState('');
    const [isSpinning, setIsSpinning] = useState(false);

    // Receipt stats tracking
    const [promptsPlayed, setPromptsPlayed] = useState(0);
    const [showReceipt, setShowReceipt] = useState(false);

    const startGame = () => {
        setIsPlaying(true);
        setPromptsPlayed(0);
        nextQuestion();
    };

    const nextQuestion = () => {
        let prompts = t('vibevote.prompts', { returnObjects: true });

        if (i18n.options.afterDark) {
            const spicyPrompts = t('vibevote.after_dark_prompts', { returnObjects: true });
            if (Array.isArray(spicyPrompts)) {
                prompts = [...prompts, ...spicyPrompts];
            }
        }

        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        setCurrentPrompt(randomPrompt);
        setShowSpinner(false);
        setIsSpinning(false);
        setPromptsPlayed(prev => prev + 1);
    };

    const spinWheel = () => {
        setIsSpinning(true);
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

        // Simulate spinning delay
        setTimeout(() => {
            const consequences = t('vibevote.consequences', { returnObjects: true });
            const randomConsequence = consequences[Math.floor(Math.random() * consequences.length)];
            setConsequence(randomConsequence);
            setIsSpinning(false);
            setShowSpinner(true);
            if (navigator.vibrate) navigator.vibrate([500]);
        }, 2000); // 2 second spin
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1 }
    };

    return (
        <div className="container flex-center" style={{ padding: '1rem', height: '100dvh' }}>
            <AnimatePresence mode="wait">
                {!isPlaying ? (
                    <motion.div
                        key="start"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="flex-center glass-card"
                        style={{ flex: 1, justifyContent: 'center', borderColor: 'var(--accent-warn)', boxShadow: '0 0 30px rgba(255, 234, 0, 0.15)' }}
                    >
                        <Users size={80} color="var(--accent-warn)" style={{ filter: 'drop-shadow(0 0 20px var(--accent-warn))', marginBottom: '1rem' }} />
                        <h2 className="title-main" style={{ fontSize: '3rem', color: 'var(--accent-warn)', textShadow: '0 0 20px rgba(255, 234, 0, 0.5)' }}>{t('menu.game_vibevote')}</h2>
                        <p style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--text-secondary)' }}>
                            {t('vibevote.rules')}
                        </p>
                        <button onClick={startGame} style={{ background: 'var(--accent-warn)', color: '#000', border: 'none', fontFamily: "'Space Grotesk', sans-serif" }}>
                            {t('common.start')}
                        </button>
                        <button onClick={onBack} style={{ background: 'transparent' }}>
                            {t('common.back')}
                        </button>
                    </motion.div>
                ) : !showSpinner && !isSpinning ? (
                    <motion.div
                        key="question"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="flex-center"
                        style={{ flex: 1, width: '100%' }}
                    >
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                            <h2 style={{
                                fontSize: '3.5rem',
                                textAlign: 'center',
                                color: 'white',
                                fontWeight: 900,
                                textShadow: '0 0 20px rgba(255, 234, 0, 0.3)',
                                lineHeight: 1.1,
                                fontFamily: "'Space Grotesk', sans-serif",
                                textTransform: 'uppercase'
                            }}>
                                "{currentPrompt}"
                            </h2>
                        </div>

                        <button
                            onClick={spinWheel}
                            style={{ background: 'var(--bg-charcoal)', borderColor: 'var(--accent-warn)' }}
                        >
                            <Dices size={24} color="var(--accent-warn)" />
                            <span style={{ color: 'var(--accent-warn)' }}>{t('vibevote.spin_wheel')}</span>
                        </button>
                        <button onClick={nextQuestion} style={{ background: 'transparent', borderBottom: '2px solid var(--accent-warn)', borderRadius: 0 }}>
                            {t('vibevote.next_question')}
                        </button>
                        <button onClick={onBack} style={{ background: 'transparent', color: 'var(--text-secondary)', marginTop: '2rem' }}>
                            {t('common.back')}
                        </button>
                    </motion.div>
                ) : isSpinning ? (
                    <motion.div
                        key="spinning"
                        className="flex-center"
                        style={{ flex: 1, width: '100%' }}
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.3, ease: "linear" }}
                        >
                            <Dices size={120} color="var(--accent-warn)" style={{ filter: 'drop-shadow(0 0 30px var(--accent-warn))' }} />
                        </motion.div>
                        <h2 style={{ marginTop: '2rem', color: 'var(--accent-warn)', letterSpacing: '8px', fontSize: '2rem', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900 }}>
                            SPINNING...
                        </h2>
                    </motion.div>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring" }}
                        className="flex-center"
                        style={{ flex: 1, width: '100%', background: 'var(--bg-charcoal)', border: '2px solid var(--accent-warn)', borderRadius: '16px', padding: '2rem' }}
                    >
                        <h2 style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '4px', fontFamily: "'Space Grotesk', sans-serif" }}>
                            LOSER MUST...
                        </h2>
                        <h1 style={{
                            fontSize: '4.5rem',
                            textAlign: 'center',
                            color: 'var(--accent-warn)',
                            fontWeight: 900,
                            marginBottom: '3rem',
                            lineHeight: 1,
                            textShadow: '0 0 30px rgba(255, 234, 0, 0.4)',
                            fontFamily: "'Space Grotesk', sans-serif",
                            textTransform: 'uppercase'
                        }}>
                            {consequence}
                        </h1>

                        <button onClick={nextQuestion} style={{ background: 'var(--accent-warn)', color: 'black', fontFamily: "'Space Grotesk', sans-serif" }}>
                            {t('vibevote.next_question')}
                        </button>

                        <div style={{ display: 'flex', gap: '0.5rem', width: '100%', flexWrap: 'wrap' }}>
                            <button onClick={() => setShowReceipt(true)} style={{ flex: '1 1 auto', minWidth: '150px', background: 'var(--glass-highlight)', color: 'var(--accent-warn)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderColor: 'rgba(255,234,0,0.3)', fontFamily: "'Space Grotesk', sans-serif" }}>
                                <Share2 size={20} /> Share Result
                            </button>
                            <button onClick={onBack} style={{ flex: '1 1 auto', minWidth: '150px', background: 'transparent' }}>
                                {t('common.back')}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Receipt Overlay */}
            <AnimatePresence>
                {showReceipt && (
                    <ShareReceipt
                        gameName={t('menu.game_vibevote')}
                        stats={[
                            { label: "PROMPTS PLAYED", value: promptsPlayed },
                            { label: "LAST PROMPT", value: `"${currentPrompt}"` },
                            { label: "CONSEQUENCE", value: consequence }
                        ]}
                        onClose={() => setShowReceipt(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
