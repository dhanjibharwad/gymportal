'use client'

import { useEffect, useRef, useState } from "react";
import { Zap, Timer, Flame, Heart } from "lucide-react";
import cardioZone from "@/assets/cardio-zone.jpg";

const cardioFeatures = [
  { icon: Timer, text: "Advanced Treadmills with incline training" },
  { icon: Zap, text: "Spin & Cycling studio area" },
  { icon: Flame, text: "HIIT Training zones and classes" },
  { icon: Heart, text: "Heart rate monitoring systems" },
];

const CardioSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[150px] -translate-y-1/2" />
      
      {/* Animated Energy Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 w-full h-px">
          <div className="h-full bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-pulse" />
        </div>
        <div className="absolute top-2/4 left-0 w-full h-px">
          <div className="h-full bg-gradient-to-r from-transparent via-accent/30 to-transparent animate-pulse" style={{ animationDelay: "0.5s" }} />
        </div>
        <div className="absolute top-3/4 left-0 w-full h-px">
          <div className="h-full bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Image */}
          <div
            className={`relative order-2 lg:order-1 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <div className="relative rounded-2xl overflow-hidden group">
              {/* Blue Glow */}
              <div className="absolute -inset-4 bg-primary/30 rounded-3xl blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
              
              {/* Image Container */}
              <div className="relative rounded-2xl overflow-hidden border border-primary/30">
                <img
                  src='/images/gym-interior.jpg'
                  alt="Cardio Zone"
                  className="w-full h-[500px] object-cover"
                />
                {/* Blue Tint Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-transparent to-transparent mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/20" />
              </div>

              {/* Animated Speed Lines */}
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-primary/80 via-accent/60 to-transparent animate-pulse" />
              <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-primary/40 via-transparent to-transparent animate-pulse" style={{ animationDelay: "0.3s" }} />
            </div>

            {/* Decorative Corner */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-primary/40 rounded-2xl -z-10" />
          </div>

          {/* Right Content */}
          <div
            className={`order-1 lg:order-2 transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <span className="text-primary font-semibold tracking-wide uppercase text-sm">
              High-Intensity Zone
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mt-4 mb-6 leading-tight">
              <span className="gradient-text">Cardio</span> & Endurance Zone
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Push your cardiovascular limits in our dedicated endurance zone. 
              Equipped with the latest technology to track your performance and 
              maximize your fat-burning potential.
            </p>

            {/* Feature List */}
            <div className="space-y-4">
              {cardioFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 group transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                  }`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/40 transition-colors duration-300">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-foreground font-medium group-hover:text-primary transition-colors duration-300">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Energy Meter */}
            <div className="mt-10 glass-card p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Calorie Burn Potential
                </span>
                <span className="text-lg font-bold gradient-text">800+ kcal/hr</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full transition-all duration-1000 delay-700 ${
                    isVisible ? "w-4/5" : "w-0"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardioSection;
