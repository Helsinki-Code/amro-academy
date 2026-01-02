"use client"

export default function LoadingSpinner() {
  return (
    <>
      <div className="pl">
        <div className="pl__outer-ring"></div>
        <div className="pl__inner-ring"></div>
        <div className="pl__track-cover"></div>
        <div className="pl__ball">
          <div className="pl__ball-texture"></div>
          <div className="pl__ball-outer-shadow"></div>
          <div className="pl__ball-inner-shadow"></div>
          <div className="pl__ball-side-shadows"></div>
        </div>
      </div>
      <style jsx>{`
        .pl {
          position: relative;
          width: 5em;
          height: 5em;
        }

        .pl__ring,
        .pl__ball {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .pl__ring {
          border-radius: 50%;
          transform-style: preserve-3d;
          animation: ringA 2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }

        .pl__outer-ring {
          border: 0.125em solid transparent;
          border-top-color: #00ced1;
          border-right-color: #00ced1;
          animation-name: ringA;
        }

        .pl__inner-ring {
          border: 0.25em solid transparent;
          border-bottom-color: #00bfff;
          border-left-color: #00bfff;
          animation-name: ringB;
          animation-delay: 0.2s;
        }

        .pl__track-cover {
          border: 0.5em solid transparent;
          border-right-color: rgba(0, 206, 209, 0.1);
          animation-name: ringC;
          animation-delay: 0.4s;
        }

        .pl__ball {
          border-radius: 50%;
          overflow: hidden;
          transform-style: preserve-3d;
          animation: ball 2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }

        .pl__ball-texture,
        .pl__ball-outer-shadow,
        .pl__ball-inner-shadow,
        .pl__ball-side-shadows {
          position: absolute;
          border-radius: 50%;
        }

        .pl__ball-texture {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(0, 206, 209, 0.6));
          animation: ballTexture 2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }

        .pl__ball-outer-shadow {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 30% 30%, transparent, rgba(0, 0, 0, 0.4));
        }

        .pl__ball-inner-shadow {
          top: 20%;
          left: 20%;
          width: 60%;
          height: 60%;
          background: radial-gradient(circle at 30% 30%, rgba(0, 206, 209, 0.4), transparent);
        }

        .pl__ball-side-shadows {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: conic-gradient(from 0deg, transparent, rgba(0, 0, 0, 0.1), transparent 30%, transparent);
        }

        @keyframes ringA {
          from {
            transform: rotateX(50deg) rotateZ(0deg);
          }
          to {
            transform: rotateX(50deg) rotateZ(360deg);
          }
        }

        @keyframes ringB {
          from {
            transform: rotateX(50deg) rotateZ(0deg);
          }
          to {
            transform: rotateX(50deg) rotateZ(-360deg);
          }
        }

        @keyframes ringC {
          from {
            transform: rotateX(50deg) rotateZ(0deg);
          }
          to {
            transform: rotateX(50deg) rotateZ(360deg);
          }
        }

        @keyframes ball {
          from {
            transform: rotateX(50deg) rotateZ(0deg);
          }
          to {
            transform: rotateX(50deg) rotateZ(720deg);
          }
        }

        @keyframes ballTexture {
          from {
            transform: rotateZ(0deg);
          }
          to {
            transform: rotateZ(-720deg);
          }
        }
      `}</style>
    </>
  );
}
