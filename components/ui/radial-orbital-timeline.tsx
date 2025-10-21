"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const round = (value: number, precision = 3) => Number(value.toFixed(precision));

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completo" | "em-progresso" | "pendente";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
  className?: string;
  minHeight?: string | number;
}

export default function RadialOrbitalTimeline({
  timelineData,
  className,
  minHeight = "32rem",
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [isInView, setIsInView] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const BASE_NODE_SIZE = 56;
  const ICON_SIZE = 22;
  const LABEL_OFFSET = BASE_NODE_SIZE / 2 + 28;
  const CARD_OFFSET = BASE_NODE_SIZE + 60;
  const GLOW_EXTRA = 28;
  const ORBIT_DIAMETER = 440;
  const ORBIT_RADIUS = ORBIT_DIAMETER / 2 - BASE_NODE_SIZE * 0.3;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setIsInView(entries[0]?.isIntersecting ?? false);
      },
      { threshold: 0.2 }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);

        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    let rotationTimer: NodeJS.Timeout;

    if (autoRotate && isInView) {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.3) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 50);
    }

    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
      }
    };
  }, [autoRotate, isInView]);

  const centerViewOnNode = (nodeId: number) => {
    if (!nodeRefs.current[nodeId]) return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radian = (angle * Math.PI) / 180;

    const x = ORBIT_RADIUS * Math.cos(radian);
    const y = ORBIT_RADIUS * Math.sin(radian);

    const zIndex = Math.round(100 + 50 * Math.cos(radian));

    return { x, y, angle, zIndex };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completo":
        return "text-(--text-on-dark) bg-(--status-complete-bg) border-(--status-border)";
      case "em-progresso":
        return "text-(--text-on-dark) bg-(--status-progress-bg) border-(--status-border)";
      case "pendente":
        return "text-(--text-muted-dark) bg-(--status-pending-bg) border-(--status-border)";
      default:
        return "text-(--text-muted-dark) bg-(--status-pending-bg) border-(--status-border)";
    }
  };

  const containerClasses = cn(
    "relative w-full flex flex-col items-center justify-center",
    className
  );

  const shouldAnimate = isInView;

  return (
    <div
      className={containerClasses}
      style={{ minHeight }}
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-4xl flex-1 flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{ perspective: "1000px" }}
        >
          <div
            className={cn(
              "absolute w-16 h-16 rounded-full bg-linear-to-br from-purple-500 via-blue-500 to-teal-500 flex items-center justify-center z-10",
              shouldAnimate && "animate-pulse"
            )}
          >
            <div
              className={cn(
                "absolute w-20 h-20 rounded-full border border-(--stroke-color)",
                shouldAnimate && "animate-ping"
              )}
            ></div>
            <div
              className={cn(
                "absolute w-24 h-24 rounded-full border border-(--stroke-color) ",
                shouldAnimate && "animate-ping"
              )}
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div className="w-8 h-8 rounded-full bg-(--text-on-dark) opacity-80 backdrop-blur-md"></div>
          </div>

          <div
            className="absolute rounded-full border border-(--stroke-color)"
            style={{ width: ORBIT_DIAMETER, height: ORBIT_DIAMETER }}
          ></div>

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            const roundedX = round(position.x);
            const roundedY = round(position.y);

            const nodeStyle = {
              transform: `translate(${roundedX}px, ${roundedY}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: 1,
            } as React.CSSProperties;

            const glowSize = item.energy * 0.45 + BASE_NODE_SIZE + GLOW_EXTRA;
            const glowOffset = (glowSize - BASE_NODE_SIZE) / 2;

            return (
              <div
                key={item.id}
                ref={(el) => {
                  nodeRefs.current[item.id] = el;
                }}
                className="absolute transition-all duration-700 cursor-pointer"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                <div
                  className={`absolute rounded-full pointer-events-none ${isPulsing && shouldAnimate ? "animate-pulse duration-1000" : ""}`}
                  style={{
                    background: "radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 70%)",
                    width: glowSize,
                    height: glowSize,
                    left: -glowOffset,
                    top: -glowOffset,
                  }}
                />

                <div
                  className={cn(
                    "flex items-center justify-center rounded-full border-2 transition-all duration-300 transform shadow-sm",
                    isExpanded
                      ? "bg-(--status-progress-bg) text-(--text-on-dark) border-(--stroke-color) shadow-lg shadow-[rgba(148,163,184,0.25)] scale-110"
                      : isRelated
                        ? "bg-(--status-complete-bg) text-(--text-on-dark) border-(--stroke-color)"
                        : "bg-(--surface-card-dark) text-(--text-on-dark) border-(--stroke-color)"
                  )}
                  style={{
                    width: BASE_NODE_SIZE,
                    height: BASE_NODE_SIZE,
                  }}
                >
                  <Icon size={ICON_SIZE} />
                </div>

                <div
                  className={`absolute whitespace-nowrap font-semibold tracking-wide transition-all duration-300 ${isExpanded ? "text-(--text-on-dark)" : "text-(--foreground-80)"
                    }`}
                  style={{
                    top: LABEL_OFFSET,
                    fontSize: isExpanded ? "1rem" : "0.95rem",
                  }}
                >
                  {item.title}
                </div>

                {isExpanded && (
                  <Card
                    className="absolute left-1/2 -translate-x-1/2 w-72 border border-(--stroke-color) bg-(--surface-panel) backdrop-blur-lg shadow-xl shadow-[rgba(15,23,42,0.4)] overflow-visible"
                    style={{ top: CARD_OFFSET }}
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-(--stroke-color)"></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge
                          className={`px-2 text-xs ${getStatusStyles(
                            item.status
                          )}`}
                        >
                          {item.status === "completo"
                            ? "COMPLETO"
                            : item.status === "em-progresso"
                              ? "EM PROGRESSO"
                              : "PENDENTE"}
                        </Badge>
                        <span className="text-xs font-mono text-(--text-muted-dark)">
                          {item.date}
                        </span>
                      </div>
                      <CardTitle className="text-sm mt-2">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-(--text-muted-dark)">
                      <p>{item.content}</p>

                      <div className="mt-4 pt-3 border-t border-(--stroke-color)">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="flex items-center">
                            <Zap size={10} className="mr-1" />
                            Experiencia
                          </span>
                          <span className="font-mono">{item.energy}%</span>
                        </div>
                        <div className="w-full h-1 bg-(--border-subtle) rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-blue-500 to-purple-500"
                            style={{ width: `${item.energy}%` }}
                          ></div>
                        </div>
                      </div>

                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-(--stroke-color)">
                          <div className="flex items-center mb-2">
                            <Link size={10} className="text-(--text-muted-dark) mr-1" />
                            <h4 className="text-xs uppercase tracking-wider font-medium text-(--text-muted-dark)">
                              Experiencias conectadas
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find(
                                (i) => i.id === relatedId
                              );
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center h-6 px-2 py-0 text-xs rounded-none border-(--stroke-color) bg-transparent text-(--text-muted-dark) transition-all hover:border-(--stroke-color) hover:bg-(--status-progress-bg) hover:text-(--text-on-dark)"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight
                                    size={8}
                                    className="ml-1 text-(--text-muted-dark)"
                                  />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
