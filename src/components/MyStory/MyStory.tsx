import React from 'react';
import './MyStory.css';

const MyStory = () => {
    return (
        <div className="mystory-container">
            <h1 className="mystory-title">My Story</h1>
            <div className="mystory-content">
                <div className="mystory-section">
                    <h2>Early Influences</h2>
                    <p>The COVID-19 pandemic was a pivotal moment for many, but for me, it highlighted the immense potential of 
            technology. As social distancing became the norm, the importance of digital communication became clear. 
            I saw a world where technology could reshape our fundamental interactions, making connections safer 
            and more accessible. This realization, combined with an  introduction to tech at an early age 
            (I was 9 years old at the time), solidified my interest in the field.</p>
                </div>
                <div className="mystory-section">
                    <h2>Challenges</h2>
                    <p>Back in 2017, I started my college journey at Shoreline Community College. As an international student, 
            I initially dived into Business Administration, influenced by my parents' apprehensions about tech-focused 
            careers. But as time rolled on, I realized that I was genuinely interested in tech. The COVID-19 pandemic 
            just made it even more obvious, showcasing how tech could shape our future.

            So, with a mix of determination and a pinch of courage, I transitioned to a major in Computer Science, 
            complemented with a minor in Economics. This shift was challenging — requiring intensive self-study 
            and adaptation. But with help and supports from my friends and some truly awesome professors, 
            I found my rhythm. By 2021, my dedication saw me transfer to the University of Washington, Bothell, 
            where I fully immersed myself in Computer Science and Software Engineering.</p>
                </div>
                <div className="mystory-section">
                    <h2>Milestones</h2>
                    <p>One of the coolest things I did during my studies was creating a cross-platform app, 
            called Polyglot Go, to help folks learn new languages. Thinking back to when I started 
            as an international student, I could totally relate to the language challenges. 
            With a buddy of mine, we got to work and built this app using Dart, Flutter, and some 
            nifty Google Cloud APIs. Every time I think about it, I can't help but be pretty proud 
            of what we achieved.</p>
                </div>
                <div className="mystory-section">
                    <h2>Personal Motivation</h2>
                    <p>You know, there's something cool about diving into the tech world. It feels a bit like 
            solving a massive puzzle. I love the process—wading through challenges, making sense 
            of things, and finally finding a solution. And it's not just about getting the right answer, 
            but the journey and the "aha!" moments along the way. With tech always changing, 
            there's always a new puzzle to solve, and I'm here and ready for it!</p>
                </div>
                <div className="mystory-section">
                    <h2>Hobbies/Interests</h2>
                    <p>Off the keyboard and away from code, I often lose myself in the rhythm of music. While I 
            don't play any instruments, there's something about a great melody that speaks to me. 
            Beyond that, mobile games offer a fun escape, and there's nothing like unwinding with a 
            captivating novel or manhua.</p>
                </div>
            </div>
        </div>
    );
};

export default MyStory;
