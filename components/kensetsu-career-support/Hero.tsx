import React from "react";

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  constrained?: boolean;
};

export default function Hero(props: Props) {
  const { src, alt, priority = false, className, constrained = true } = props;

  return (
    <div className={"kcsHero " + (className ?? "")}>
      <div className={constrained ? "kcsHeroInner" : "kcsHeroInnerFull"}>
        <img
          src={src}
          alt={alt}
          className="kcsHeroImg"
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      </div>

      <style jsx>{`
        .kcsHero {
          width: 100%;
          padding: 16px;
          display: flex;
          justify-content: center;
        }

        .kcsHeroInner {
          width: min(960px, 100%);
        }

        .kcsHeroInnerFull {
          width: 100%;
        }

        .kcsHeroImg {
          width: 100%;
          height: auto;
          display: block;
        }

        @media (max-width: 420px) {
          .kcsHero {
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}