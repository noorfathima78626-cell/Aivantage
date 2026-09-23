import React from 'react'
import { useNavigate } from 'react-router-dom'

const features = [
  ['01', 'Human-style HR practice', 'Practice with a real-person interviewer video, natural voice prompts and a camera-first interview layout.'],
  ['02', 'Technical interviews', 'Choose DSA, DBMS, OS, OOP, Java, Python, SQL, ML and more with difficulty-based questions.'],
  ['03', 'Timed aptitude', 'Solve MCQs under a real time limit with navigation, question palette and automatic submission.'],
  ['04', 'Interview signals', 'Get live feedback on eye contact, hand movement and speaking pace while you answer.'],
]

export default function Home() {
  const navigate = useNavigate()
  return (
    <div className="home-page">
      <header className="home-nav">
        <div className="brand"><span className="brand-dot" />Aivantage</div>
        <div className="home-nav-actions">
          <button className="btn-secondary" onClick={() => navigate('/login')}>Log in</button>
          <button className="btn-primary" onClick={() => navigate('/register')}>Create account</button>
        </div>
      </header>

      <main>
        <section className="home-hero">
          <div className="home-hero-copy">
            <span className="eyebrow home-kicker">AI INTERVIEW PRACTICE • BUILT FOR PLACEMENTS</span>
            <h1>Practice the interview.<br /><span>Not just the questions.</span></h1>
            <p>Prepare for HR, technical and aptitude rounds in one focused practice room. Speak naturally, see your performance signals and build confidence before the real interview.</p>
            <div className="home-cta-row">
              <button className="btn-primary home-cta" onClick={() => navigate('/register')}>Start practicing <strong>→</strong></button>
              <button className="btn-secondary home-ghost" onClick={() => navigate('/login')}>I already have an account</button>
            </div>
            <div className="home-trust"><span>●</span> Camera & microphone based practice <i /> <span>●</span> Subject-specific questions <i /> <span>●</span> Timed aptitude mode</div>
          </div>

          <div className="home-hero-visual home-clean-visual">
            <div className="home-visual-heading">
              <span className="eyebrow">PRACTICE WITH PURPOSE</span>
              <strong>One room. Three interview modes.</strong>
            </div>
            <div className="home-mode-list">
              <div className="home-mode-row active"><span className="mode-number">01</span><div><b>HR Interview</b><small>Confidence, communication &amp; common HR questions</small></div></div>
              <div className="home-mode-row"><span className="mode-number">02</span><div><b>Technical</b><small>DSA, DBMS, OS, OOP, Java, Python &amp; more</small></div></div>
              <div className="home-mode-row"><span className="mode-number">03</span><div><b>Aptitude</b><small>Timed MCQs with question navigation</small></div></div>
            </div>
            <div className="home-visual-note"><span className="quiet-dot" /> Camera-first practice <i /> Natural voice prompts <i /> Performance review</div>
          </div>
        </section>

        <section className="home-section home-features">
          <div className="home-section-heading"><span className="eyebrow">ONE PLATFORM</span><h2>Everything you need to get interview-ready.</h2><p>Move from nervous practice to structured, repeatable preparation.</p></div>
          <div className="feature-grid">{features.map(([num, title, body]) => <article className="home-feature" key={num}><span>{num}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
        </section>

        <section className="home-section home-flow">
          <div><span className="eyebrow">HOW IT WORKS</span><h2>Pick. Prepare. Perform.</h2></div>
          <div className="flow-steps"><div><b>01</b><strong>Choose a mode</strong><p>HR, one-on-one technical or aptitude.</p></div><div><b>02</b><strong>Set your level</strong><p>Easy, medium or hard questions.</p></div><div><b>03</b><strong>Enter the room</strong><p>Camera, microphone and interview signals.</p></div><div><b>04</b><strong>Review your result</strong><p>See what to improve for the next attempt.</p></div></div>
        </section>

        <section className="home-bottom-cta"><div><span className="eyebrow">YOUR NEXT INTERVIEW STARTS HERE</span><h2>Turn practice into confidence.</h2></div><button className="btn-primary home-cta" onClick={() => navigate('/register')}>Get started free <strong>→</strong></button></section>
      </main>
    </div>
  )
}
