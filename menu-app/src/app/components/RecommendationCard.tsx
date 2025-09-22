import Image from "next/image";
import type { ReactNode } from "react";

interface RecommendationCardProps {
  imageSrc: string;
  title: string;
  subtitle?: string;
  bullets: ReactNode[];
  circleClassName?: string;
}

export default function RecommendationCard({
  imageSrc,
  title,
  subtitle,
  bullets,
  circleClassName,
}: RecommendationCardProps) {
  return (
    <div className="group flex items-center justify-center gap-12 max-w-3xl md:max-w-4xl mx-auto w-full transition-all duration-500">
      <div
        className={
          `${circleClassName ?? "w-64 h-64"} rounded-full bg-[#1E3932] flex items-center justify-center overflow-hidden transition-transform duration-500 ease-out group-hover:-translate-x-8`
        }
      >
        <Image src={imageSrc} alt={title} width={120} height={120} className="object-contain" priority />
      </div>
      <div className="flex-1 relative h-64 md:h-72">
        <div className="absolute inset-0 flex items-center justify-center md:justify-start transition-opacity duration-300 ease-out group-hover:opacity-0">
          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-4xl font-extrabold text-[#ff6b45]">{title}</h3>
            {subtitle && (
              <p className="text-lg md:text-xl text-[#243b35] mt-2 italic">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 flex items-center overflow-y-auto pr-2">
          <div>
            <h3 className="text-xl md:text-2xl font-extrabold text-[#ff6b45] mb-2">{title}</h3>
            {subtitle && (
              <p className="text-sm md:text-base text-[#243b35] mb-3 italic">{subtitle}</p>
            )}
            <div className="text-sm md:text-base text-[#243b35] space-y-2">
              {bullets.map((b, i) => (
                <p key={i}>{b}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


