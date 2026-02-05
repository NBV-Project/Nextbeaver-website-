"use client";

import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import gsap from 'gsap';

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: 'linear' | 'elastic';
  containerClassName?: string;
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`absolute top-1/2 left-1/2 rounded-xl border border-white bg-black [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
  />
));
Card.displayName = 'Card';

type CardRef = RefObject<HTMLDivElement | null>;
interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

const CardSwap: React.FC<CardSwapProps> = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = 'elastic',
  containerClassName,
  children
}) => {
  const config = useMemo(() => 
    easing === 'elastic'
      ? {
        ease: 'elastic.out(0.6,0.9)',
        durDrop: 2,
        durMove: 2,
        durReturn: 2,
        promoteOverlap: 0.9,
        returnDelay: 0.05
      }
      : {
        ease: 'power1.inOut',
        durDrop: 0.8,
        durMove: 0.8,
        durReturn: 0.8,
        promoteOverlap: 0.45,
        returnDelay: 0.2
      }, [easing]);

  const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children]);
  // Fixed: use childArr as dependency
  const refs = useMemo<CardRef[]>(() => childArr.map(() => React.createRef<HTMLDivElement>()), [childArr]);

  const order = useRef<number[]>(Array.from({ length: childArr.length }, (_, i) => i));

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number>(0);
  const container = useRef<HTMLDivElement>(null);
  const swapRef = useRef<() => void>(() => undefined);
  const startIntervalRef = useRef<() => void>(() => undefined);
  const stopIntervalRef = useRef<() => void>(() => undefined);
  const prefersReducedRef = useRef(false);
  const isActiveRef = useRef(true);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    prefersReducedRef.current =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    const node = container.current;
    if (!node || typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isActiveRef.current = entry.isIntersecting;
        setIsActive(entry.isIntersecting);
      },
      { rootMargin: '200px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    startIntervalRef.current = () => {
      clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(() => swapRef.current(), delay);
    };
    stopIntervalRef.current = () => {
      clearInterval(intervalRef.current);
    };
  }, [delay]);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => placeNow(r.current!, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current!;
      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: '+=500',
        duration: config.durDrop,
        ease: config.ease
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current!;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${i * 0.15}`
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        'return'
      );
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease
        },
        'return'
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    swapRef.current = swap;
    if (prefersReducedRef.current) return;
    if (isActiveRef.current) {
      swap();
    }

    if (pauseOnHover) {
      const node = container.current!;
      const pause = () => {
        if (!isActiveRef.current) return;
        tlRef.current?.pause();
        stopIntervalRef.current();
      };
      const resume = () => {
        if (!isActiveRef.current) return;
        tlRef.current?.play();
        startIntervalRef.current();
      };
      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
      return () => {
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
        stopIntervalRef.current();
      };
    }
    return () => stopIntervalRef.current();
  }, [cardDistance, verticalDistance, pauseOnHover, skewAmount, refs, config]);

  useEffect(() => {
    if (prefersReducedRef.current) return;
    if (isActive) {
      tlRef.current?.play();
      startIntervalRef.current();
      return;
    }
    tlRef.current?.pause();
    stopIntervalRef.current();
  }, [isActive, delay]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof MutationObserver === "undefined") {
      return;
    }
    const root = document.documentElement;
    const handleThemeAnimation = () => {
      const isAnimating = root.dataset.themeAnimating === "true";
      if (isAnimating) {
        tlRef.current?.pause();
        stopIntervalRef.current();
        return;
      }
      if (isActiveRef.current) {
        tlRef.current?.play();
        startIntervalRef.current();
      }
    };
    const observer = new MutationObserver(() => {
      handleThemeAnimation();
    });
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme-animating"] });
    handleThemeAnimation();
    return () => observer.disconnect();
  }, []);

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
        key: i,
        ref: refs[i],
        style: { width, height, ...(child.props.style ?? {}) },
        onClick: e => {
          child.props.onClick?.(e as React.MouseEvent<HTMLDivElement>);
          onCardClick?.(i);
        }
      } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child
  );

  return (
    <div
      ref={container}
      className={`relative w-full h-full perspective-[900px] overflow-visible ${containerClassName ?? ''}`.trim()}
      style={{ width, height }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/2 w-full h-full sm:-translate-x-1/3 md:-translate-x-1/4 lg:left-[60%] lg:-translate-x-1/2">
        {rendered}
      </div>
    </div>
  );
};

export default CardSwap;
