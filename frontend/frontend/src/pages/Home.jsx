import React from 'react'
import { useNavigate } from 'react-router-dom'

const features = [
  ['01', 'Human-style HR practice', 'Practice with a realistic interviewer, natural voice prompts and a camera-first interview layout.'],
  ['02', 'Technical interviews', 'Answer aloud or work through coding questions with subject-specific AI evaluation.'],
  ['03', 'Timed aptitude', 'Solve MCQs under a real time limit with navigation, question palette and automatic submission.'],
  ['04', 'Interview signals', 'Review eye contact, hand movement and speaking pace to understand your interview habits.'],
]

const modes = [
  ['01', 'HR Interview', 'Confidence, communication & common HR questions'],
  ['02', 'Technical', 'Verbal & coding questions, scored by AI'],
  ['03', 'Aptitude', 'Timed MCQs with question navigation'],
]

const flow = [
  ['01', 'Choose a mode', 'HR, one-on-one technical or aptitude.'],
  ['02', 'Set your level', 'Easy, medium or hard questions.'],
  ['03', 'Enter the room', 'Camera, microphone and interview signals.'],
  ['04', 'Review your result', 'See what to improve for the next attempt.'],
]

function HomeStyles() {
  return (
    <style>{`
      .av-home {
        min-height: 100vh;
        color: #eef3ff;
        background:
          radial-gradient(circle at 78% 18%, rgba(41, 211, 194, 0.15), transparent 30%),
          radial-gradient(circle at 12% 10%, rgba(109, 124, 255, 0.18), transparent 28%),
          linear-gradient(135deg, #07101f 0%, #101c39 52%, #12384a 100%);
        overflow-x: hidden;
      }

      .av-home *,
      .av-home *::before,
      .av-home *::after {
        box-sizing: border-box;
      }

      .av-home button {
        font: inherit;
      }

      .av-home-nav {
        width: min(1180px, calc(100% - 40px));
        margin: 0 auto;
        min-height: 78px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
      }

      .av-brand {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        color: #ffffff;
        font-size: 25px;
        font-weight: 800;
        letter-spacing: -0.6px;
      }

      .av-brand-dot {
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: #6d7cff;
        box-shadow: 0 0 18px rgba(109,124,255,.8);
      }

      .av-nav-actions,
      .av-cta-row {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }

      .av-btn {
        min-height: 44px;
        padding: 0 19px;
        border: 1px solid transparent;
        border-radius: 12px;
        cursor: pointer;
        font-weight: 750;
        transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
      }

      .av-btn:hover {
        transform: translateY(-2px);
      }

      .av-btn-primary {
        color: #fff;
        background: linear-gradient(135deg, #6d7cff, #8170ff);
        box-shadow: 0 12px 28px rgba(70, 75, 190, .28);
      }

      .av-btn-primary:hover {
        box-shadow: 0 16px 34px rgba(70, 75, 190, .4);
      }

      .av-btn-secondary {
        color: #eef3ff;
        background: rgba(255,255,255,.06);
        border-color: rgba(255,255,255,.13);
      }

      .av-main {
        width: min(1180px, calc(100% - 40px));
        margin: 0 auto;
      }

      .av-hero {
        min-height: 570px;
        display: grid;
        grid-template-columns: minmax(0, 1.04fr) minmax(420px, .96fr);
        align-items: center;
        gap: 52px;
        padding: 64px 0 76px;
      }

      .av-kicker {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: #8e9cff;
        font-size: 12px;
        line-height: 1.4;
        font-weight: 800;
        letter-spacing: 1.4px;
        text-transform: uppercase;
      }

      .av-kicker::before {
        content: '';
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #29d3c2;
        box-shadow: 0 0 12px rgba(41,211,194,.7);
      }

      .av-hero-copy h1 {
        margin: 18px 0 20px;
        max-width: 720px;
        color: #ffffff;
        font-size: clamp(44px, 5.3vw, 72px);
        line-height: .98;
        letter-spacing: -3px;
      }

      .av-hero-copy h1 span {
        color: #aeb8ff;
      }

      .av-hero-copy > p {
        max-width: 690px;
        margin: 0 0 28px;
        color: #b9c5df;
        font-size: 17px;
        line-height: 1.7;
      }

      .av-trust {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 20px;
        color: #93a1bd;
        font-size: 13px;
      }

      .av-trust-dot {
        color: #29d3c2;
        font-size: 15px;
      }

      .av-divider {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #56637d;
      }

      .av-visual {
        position: relative;
        padding: 28px;
        border: 1px solid rgba(255,255,255,.12);
        border-radius: 28px;
        background:
          linear-gradient(145deg, rgba(255,255,255,.09), rgba(255,255,255,.035)),
          rgba(7,16,31,.42);
        box-shadow: 0 30px 80px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.06);
        backdrop-filter: blur(18px);
      }

      .av-visual::after {
        content: '';
        position: absolute;
        width: 130px;
        height: 130px;
        right: -35px;
        bottom: -40px;
        border-radius: 50%;
        background: rgba(41,211,194,.15);
        filter: blur(30px);
        pointer-events: none;
      }

      .av-visual-heading {
        display: grid;
        gap: 7px;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(255,255,255,.09);
      }

      .av-visual-heading strong {
        color: #ffffff;
        font-size: 23px;
        letter-spacing: -.5px;
      }

      .av-mode-list {
        display: grid;
        gap: 10px;
        margin: 18px 0;
      }

      .av-mode-row {
        display: grid;
        grid-template-columns: 48px 1fr;
        align-items: center;
        gap: 13px;
        min-height: 84px;
        padding: 14px 16px;
        border: 1px solid transparent;
        border-radius: 17px;
        background: rgba(255,255,255,.035);
      }

      .av-mode-row.active {
        border-color: rgba(109,124,255,.42);
        background: linear-gradient(100deg, rgba(109,124,255,.19), rgba(255,255,255,.04));
      }

      .av-mode-number {
        display: grid;
        place-items: center;
        width: 42px;
        height: 42px;
        border-radius: 12px;
        color: #aeb8ff;
        background: rgba(109,124,255,.12);
        font-size: 12px;
        font-weight: 800;
      }

      .av-mode-row b {
        display: block;
        margin-bottom: 5px;
        color: #fff;
        font-size: 16px;
      }

      .av-mode-row small {
        display: block;
        color: #96a5c1;
        font-size: 13px;
        line-height: 1.45;
      }

      .av-visual-note {
        display: flex;
        align-items: center;
        gap: 9px;
        flex-wrap: wrap;
        color: #93a1bd;
        font-size: 12px;
      }

      .av-quiet-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #29d3c2;
      }

      .av-section {
        padding: 82px 0;
      }

      .av-section-heading {
        max-width: 720px;
        margin-bottom: 34px;
      }

      .av-section-heading h2,
      .av-flow h2,
      .av-bottom h2 {
        margin: 10px 0 12px;
        color: #fff;
        font-size: clamp(30px, 4vw, 46px);
        line-height: 1.08;
        letter-spacing: -1.8px;
      }

      .av-section-heading p {
        margin: 0;
        color: #9eabc4;
        font-size: 16px;
      }

      .av-feature-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 15px;
      }

      .av-feature {
        min-height: 230px;
        padding: 25px;
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 20px;
        background: rgba(255,255,255,.045);
        transition: transform .2s ease, background .2s ease, border-color .2s ease;
      }

      .av-feature:hover {
        transform: translateY(-5px);
        background: rgba(255,255,255,.065);
        border-color: rgba(109,124,255,.35);
      }

      .av-feature > span {
        color: #7f8dff;
        font-size: 12px;
        font-weight: 850;
        letter-spacing: 1px;
      }

      .av-feature h3 {
        margin: 38px 0 10px;
        color: #fff;
        font-size: 19px;
      }

      .av-feature p {
        margin: 0;
        color: #9eabc4;
        font-size: 14px;
        line-height: 1.65;
      }

      .av-flow {
        display: grid;
        grid-template-columns: .7fr 1.3fr;
        gap: 60px;
        align-items: start;
        border-top: 1px solid rgba(255,255,255,.08);
      }

      .av-flow-steps {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
      }

      .av-flow-step {
        min-height: 165px;
        padding: 24px;
        border-radius: 18px;
        background: rgba(255,255,255,.04);
        border: 1px solid rgba(255,255,255,.08);
      }

      .av-flow-step b {
        color: #7f8dff;
        font-size: 12px;
      }

      .av-flow-step strong {
        display: block;
        margin: 25px 0 7px;
        color: #fff;
        font-size: 17px;
      }

      .av-flow-step p {
        margin: 0;
        color: #94a2bd;
        font-size: 13px;
        line-height: 1.55;
      }

      .av-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 30px;
        margin: 35px 0 70px;
        padding: 42px;
        border: 1px solid rgba(109,124,255,.22);
        border-radius: 25px;
        background: linear-gradient(110deg, rgba(109,124,255,.14), rgba(41,211,194,.07));
      }

      .av-bottom h2 {
        margin-bottom: 0;
      }

      @media (max-width: 980px) {
        .av-hero {
          grid-template-columns: 1fr;
          gap: 35px;
          padding-top: 45px;
        }

        .av-visual {
          max-width: 700px;
        }

        .av-feature-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .av-flow {
          grid-template-columns: 1fr;
          gap: 25px;
        }
      }

      @media (max-width: 620px) {
        .av-home-nav,
        .av-main {
          width: min(100% - 28px, 1180px);
        }

        .av-home-nav {
          min-height: 70px;
        }

        .av-brand {
          font-size: 21px;
        }

        .av-nav-actions .av-btn {
          min-height: 40px;
          padding: 0 12px;
          font-size: 13px;
        }

        .av-hero {
          padding: 35px 0 55px;
        }

        .av-hero-copy h1 {
          font-size: 43px;
          letter-spacing: -2px;
        }

        .av-hero-copy > p {
          font-size: 15px;
        }

        .av-visual {
          padding: 19px;
          border-radius: 21px;
        }

        .av-feature-grid,
        .av-flow-steps {
          grid-template-columns: 1fr;
        }

        .av-section {
          padding: 55px 0;
        }

        .av-bottom {
          align-items: flex-start;
          flex-direction: column;
          margin-bottom: 35px;
          padding: 28px 22px;
        }
      }
    `}</style>
  )
}

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="av-home">
      <HomeStyles />

      <header className="av-home-nav">
        <div className="av-brand">
          <span className="av-brand-dot" />
          Aivantage
        </div>

        <div className="av-nav-actions">
          <button className="av-btn av-btn-secondary" onClick={() => navigate('/login')}>
            Log in
          </button>
          <button className="av-btn av-btn-primary" onClick={() => navigate('/register')}>
            Create account
          </button>
        </div>
      </header>

      <main className="av-main">
        <section className="av-hero">
          <div className="av-hero-copy">
            <span className="av-kicker">AI INTERVIEW PRACTICE • BUILT FOR PLACEMENTS</span>

            <h1>
              Practice the interview.
              <br />
              <span>Not just the questions.</span>
            </h1>

            <p>
              Prepare for HR, technical and aptitude rounds in one focused practice
              room. Speak naturally, see your performance signals and build
              confidence before the real interview.
            </p>

            <div className="av-cta-row">
              <button className="av-btn av-btn-primary" onClick={() => navigate('/register')}>
                Start practicing →
              </button>
              <button className="av-btn av-btn-secondary" onClick={() => navigate('/login')}>
                I already have an account
              </button>
            </div>

            <div className="av-trust">
              <span className="av-trust-dot">●</span>
              Camera &amp; microphone practice
              <span className="av-divider" />
              <span className="av-trust-dot">●</span>
              Subject-specific questions
              <span className="av-divider" />
              <span className="av-trust-dot">●</span>
              Timed aptitude mode
            </div>
          </div>

          <div className="av-visual">
            <div className="av-visual-heading">
              <span className="av-kicker">PRACTICE WITH PURPOSE</span>
              <strong>One room. Three interview modes.</strong>
            </div>

            <div className="av-mode-list">
              {modes.map(([number, title, body], index) => (
                <div className={`av-mode-row ${index === 0 ? 'active' : ''}`} key={number}>
                  <span className="av-mode-number">{number}</span>
                  <div>
                    <b>{title}</b>
                    <small>{body}</small>
                  </div>
                </div>
              ))}
            </div>

            <div className="av-visual-note">
              <span className="av-quiet-dot" />
              Camera-first practice
              <span className="av-divider" />
              Natural voice prompts
              <span className="av-divider" />
              Performance review
            </div>
          </div>
        </section>

        <section className="av-section">
          <div className="av-section-heading">
            <span className="av-kicker">ONE PLATFORM</span>
            <h2>Everything you need to get interview-ready.</h2>
            <p>Move from nervous practice to structured, repeatable preparation.</p>
          </div>

          <div className="av-feature-grid">
            {features.map(([number, title, body]) => (
              <article className="av-feature" key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="av-section av-flow">
          <div>
            <span className="av-kicker">HOW IT WORKS</span>
            <h2>Pick. Prepare. Perform.</h2>
          </div>

          <div className="av-flow-steps">
            {flow.map(([number, title, body]) => (
              <div className="av-flow-step" key={number}>
                <b>{number}</b>
                <strong>{title}</strong>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="av-bottom">
          <div>
            <span className="av-kicker">YOUR NEXT INTERVIEW STARTS HERE</span>
            <h2>Turn practice into confidence.</h2>
          </div>

          <button className="av-btn av-btn-primary" onClick={() => navigate('/register')}>
            Get started free →
          </button>
        </section>
      </main>
    </div>
  )
}