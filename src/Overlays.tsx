import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {BLACKOUT_START, CAPTIONS, DURATION, FPS, TITLE_START, getShot, lightLevel} from './shots';

const FONT = '"Courier New", ui-monospace, monospace';
const pixelShadow = '3px 3px 0 #000';

const WHO_COLOR: Record<string, string> = {
  LARAS: '#c79bff',
  WINDU: '#5fd0c8',
  PENELPON: '#bfc6d6',
};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{mixBlendMode: 'overlay', opacity: 0.2, pointerEvents: 'none'}}>
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % 9} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Overlays: React.FC = () => {
  const frame = useCurrentFrame();
  const lv = lightLevel(frame);
  const shot = getShot(frame);
  const caption = CAPTIONS.find((c) => frame >= c.from && frame <= c.to);

  const fadeIn = interpolate(frame, [0, 10], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fadeOut = interpolate(frame, [DURATION - 14, DURATION - 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // REC timecode: mulai 03:03:12, naik 1 detik per 30 frame
  const totalSec = 3 * 3600 + 3 * 60 + 12 + Math.floor(frame / FPS);
  const hh = String(Math.floor(totalSec / 3600) % 24).padStart(2, '0');
  const mm = String(Math.floor(totalSec / 60) % 60).padStart(2, '0');
  const ss = String(totalSec % 60).padStart(2, '0');
  const timecode = `${hh}:${mm}:${ss}`;
  const recBlink = Math.floor(frame / 15) % 2 === 0;

  const titleOpacity =
    frame >= TITLE_START ? (random(`title-${Math.floor(frame / 2)}`) > 0.25 ? 1 : 0.15) : 0;

  const glitch = frame >= BLACKOUT_START && frame < TITLE_START && random(`gl-${frame}`) > 0.8;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {/* grading dingin */}
      <AbsoluteFill style={{background: 'rgba(8,22,42,0.28)', mixBlendMode: 'soft-light'}} />
      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0) 38%, rgba(0,0,0,0.55) 72%, rgba(0,0,0,0.92) 100%)',
        }}
      />
      {/* scanline */}
      <AbsoluteFill
        style={{
          background:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.0) 0px, rgba(0,0,0,0.0) 2px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.0) 4px)',
          opacity: 0.6,
        }}
      />
      <Grain />
      {glitch && (
        <AbsoluteFill style={{background: 'rgba(255,20,20,0.07)', transform: 'translateX(14px)'}} />
      )}

      {/* HUD */}
      <div style={{position: 'absolute', left: 56, top: 44, fontFamily: FONT, fontWeight: 700, color: '#e9e9ee', fontSize: 30, textShadow: pixelShadow, letterSpacing: 2}}>
        <span style={{color: '#ff2a2a', opacity: recBlink ? 1 : 0.15}}>●</span> REC {timecode}
      </div>
      <div style={{position: 'absolute', right: 56, top: 44, fontFamily: FONT, fontWeight: 700, color: '#bfc6d6', fontSize: 28, textShadow: pixelShadow, letterSpacing: 2, textAlign: 'right', opacity: 0.9}}>
        TEROR FM
        <div style={{fontSize: 18, opacity: 0.6, marginTop: 6}}>
          {shot.id} · {shot.label.split(' - ')[0].split(' (')[0]}
        </div>
      </div>

      {/* subtitle */}
      {caption && lv > 0.05 && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 90,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 40,
              color: '#f2f2f2',
              background: 'rgba(0,0,0,0.55)',
              padding: '10px 22px',
              textShadow: '3px 3px 0 #000',
              opacity: interpolate(frame, [caption.from, caption.from + 4, caption.to - 4, caption.to], [0, 1, 1, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
              fontStyle: caption.whisper ? 'italic' : 'normal',
            }}
          >
            <span style={{color: WHO_COLOR[caption.who]}}>
              {'<'}
              {caption.who}
              {'> '}
            </span>
            {caption.text}
          </div>
        </div>
      )}

      {/* judul akhir */}
      {titleOpacity > 0 && (
        <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 150}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 64, letterSpacing: 10, color: '#ff2a1f', opacity: titleOpacity, textShadow: '0 0 24px #ff1208, 4px 4px 0 #000'}}>
            SIARAN INI BELUM SELESAI
          </div>
        </AbsoluteFill>
      )}

      <AbsoluteFill style={{background: '#000', opacity: Math.max(fadeIn, fadeOut)}} />
    </AbsoluteFill>
  );
};
