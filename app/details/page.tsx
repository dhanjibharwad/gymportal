'use client'

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Star, Clock, Users, Trophy } from "lucide-react";
import Link from "next/link";

const DetailsPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      ref={detailsRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src='/images/gym.jpg'
          alt="Gym equipment details"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-background/20" />
      </div>

      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-float" />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-[100px] animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />

      {/* Particles */}
      <div className="absolute inset-0 z-10 opacity-30">
        {isVisible && [...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6">
        <div
          className={`transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {/* Back Button */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Home
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 leading-[0.9]">
                <span className="block text-foreground">Premium</span>
                <span className="block bg-gradient-to-r from-yellow-400 to-blue-500 bg-clip-text text-transparent mt-2">
                  Fitness Experience
                </span>
              </h1>

              <p
                className={`text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed transition-all duration-1000 delay-300 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                Discover state-of-the-art equipment, personalized training programs, and a supportive community 
                designed to help you achieve your fitness goals faster than ever before.
              </p>

              {/* Stats */}
              <div
                className={`grid grid-cols-2 gap-6 mb-8 transition-all duration-1000 delay-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <Users className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-sm text-white/80">Active Members</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <Trophy className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">50+</div>
                  <div className="text-sm text-white/80">Equipment Types</div>
                </div>
              </div>
            </div>

            {/* Right Content - Features */}
            <div
              className={`space-y-6 transition-all duration-1000 delay-700 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              }`}
            >
              <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-xl font-semibold text-white">Expert Training</h3>
                </div>
                <p className="text-white/80">
                  Certified personal trainers with years of experience to guide your fitness journey.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <Clock className="w-6 h-6 text-blue-500" />
                  <h3 className="text-xl font-semibold text-white">24/7 Access</h3>
                </div>
                <p className="text-white/80">
                  Train on your schedule with round-the-clock gym access for all members.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-xl font-semibold text-white">Modern Equipment</h3>
                </div>
                <p className="text-white/80">
                  Latest fitness technology and equipment from top brands worldwide.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div
            className={`text-center mt-12 transition-all duration-1000 delay-900 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <button className="group min-w-[200px] px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-blue-500 text-black font-semibold hover:scale-105 transition">
              Start Your Journey
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailsPage;