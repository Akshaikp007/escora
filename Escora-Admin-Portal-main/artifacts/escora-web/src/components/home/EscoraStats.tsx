import React from "react";
import { motion, useInView, useReducedMotion, animate, type Variants } from "framer-motion";
import "./EscoraStats.css";

interface StatItemData {
  id: string;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

const STATS: StatItemData[] = [
  { id: "years", value: 10, label: "YEARS OF CURATING" },
  { id: "travellers", value: 2400, suffix: "+", label: "TRAVELLERS" },
  { id: "regions", value: 14, label: "DISTINCTIVE REGIONS" },
  { id: "guests", value: 98, suffix: "%", label: "RETURNING GUESTS" },
];

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const;

interface CounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
  isInView: boolean;
}

function StatCounter({ value, prefix = "", suffix = "", delay = 0, isInView }: CounterProps) {
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = React.useState<number>(shouldReduceMotion ? value : 0);

  React.useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(value);
      return;
    }

    if (!isInView) return;

    let controls: { stop: () => void } | null = null;
    const timeout = setTimeout(() => {
      controls = animate(0, value, {
        duration: 2.0,
        ease: EASE_LUXURY,
        onUpdate: (latest) => {
          setDisplayValue(Math.round(latest));
        },
      });
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      controls?.stop();
    };
  }, [isInView, value, delay, shouldReduceMotion]);

  return (
    <span className="escora-stat-number" aria-label={`${prefix}${value}${suffix}`}>
      {prefix}
      <span>{displayValue.toLocaleString("en-US")}</span>
      {suffix && <span className="escora-stat-suffix">{suffix}</span>}
    </span>
  );
}

export default function EscoraStats() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.25 });
  const shouldReduceMotion = useReducedMotion();

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 22,
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.95,
        ease: EASE_LUXURY,
        delay: shouldReduceMotion ? 0 : index * 0.12,
      },
    }),
  };

  const dividerVariants: Variants = {
    hidden: {
      scaleY: 0,
      opacity: 0,
    },
    visible: (index: number) => ({
      scaleY: 1,
      opacity: 1,
      transition: {
        duration: 1.15,
        ease: EASE_LUXURY,
        delay: shouldReduceMotion ? 0 : 0.25 + index * 0.15,
      },
    }),
  };

  return (
    <section ref={sectionRef} className="escora-stats-section" aria-label="Key statistics">
      <div className="escora-stats-container">
        <div className="escora-stats-grid">
          {STATS.map((item, index) => (
            <motion.div
              key={item.id}
              className="escora-stat-item"
              custom={index}
              variants={itemVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <StatCounter
                value={item.value}
                prefix={item.prefix}
                suffix={item.suffix}
                delay={0.12 + index * 0.12}
                isInView={isInView}
              />
              <span className="escora-stat-label">{item.label}</span>

              {index < STATS.length - 1 && (
                <motion.div
                  className="escora-stat-divider"
                  custom={index}
                  variants={dividerVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  aria-hidden="true"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

