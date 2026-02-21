import { useTranslation } from 'react-i18next';
import { Flame, Hand, Users, Target } from 'lucide-react';

const GAMES = [
    { key: 'bomb31', Icon: Flame, labelKey: 'menu.game_31bomb', color: 'var(--accent-primary)' },
    { key: 'nunchitap', Icon: Hand, labelKey: 'menu.game_nunchitap', color: 'var(--accent-secondary)' },
    { key: 'vibevote', Icon: Users, labelKey: 'menu.game_vibevote', color: 'var(--accent-warn)' },
    { key: 'neverhave', Icon: Target, labelKey: 'menu.game_never_have_i_ever', color: 'var(--neon-blue)' },
    { key: 'kingscup', Icon: null, labelKey: 'menu.game_kings_cup', color: 'var(--neon-pink)' },
];

export const GameRecommendations = ({ currentGame, onSelectGame }) => {
    const { t } = useTranslation();
    const others = GAMES.filter(g => g.key !== currentGame);

    return (
        <div style={{
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--glass-border)',
            width: '100%'
        }}>
            <p style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '3px',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                marginBottom: '0.6rem',
                textAlign: 'center',
                fontFamily: "'Space Grotesk', sans-serif"
            }}>
                PLAY NEXT
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {others.map(({ key, Icon, labelKey, color }) => (
                    <button
                        key={key}
                        onClick={() => onSelectGame(key)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.35rem 0.75rem',
                            background: 'rgba(255,255,255,0.04)',
                            border: `1px solid ${color}44`,
                            borderRadius: '999px',
                            color: color,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            fontFamily: "'Space Grotesk', sans-serif",
                            transition: 'background 0.15s ease, border-color 0.15s ease',
                            whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = `${color}18`;
                            e.currentTarget.style.borderColor = color;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                            e.currentTarget.style.borderColor = `${color}44`;
                        }}
                    >
                        {Icon && <Icon size={12} />}
                        {t(labelKey)}
                    </button>
                ))}
            </div>
        </div>
    );
};
