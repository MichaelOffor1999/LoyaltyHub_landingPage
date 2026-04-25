"use client";

import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
	{
		initial: "H",
		name: "Setup",
		color: "linear-gradient(135deg,#c97b3a,#e8944a)",
		q: "How does clientIn work?",
		a: "Each customer gets their own QR code in the clientIn app. You scan it at the till to stamp their loyalty card. When they hit their reward threshold, they redeem it: discounts, free services, VIP perks, whatever you set.",
	},
	{
		initial: "A",
		name: "App",
		color: "linear-gradient(135deg,#1e3a5f,#2d6a9f)",
		q: "Do my customers need to download an app?",
		a: "Yes, customers use the clientIn app to track their stamps and rewards. It's completely free for them and will be available on both iOS and Android.",
	},
	{
		initial: "C",
		name: "Collabs",
		color: "linear-gradient(135deg,#1e4d2b,#2d7a45)",
		q: "What are clientIn Collabs?",
		a: "Your partner's loyal customers become your new customers. You tap into a warm, local audience that already trusts a business like yours, without spending a penny on ads.",
	},
	{
		initial: "W",
		name: "WhatsApp",
		color: "linear-gradient(135deg,#1a5c35,#25d366)",
		q: "What is the WhatsApp AI assistant?",
		a: "Your AI business manager on WhatsApp. It spots slow days, fading customers, and missed opportunities, then tells you exactly what to do. You approve, it handles the rest.",
	},
	{
		initial: "L",
		name: "Launch",
		color: "linear-gradient(135deg,#5b1e6e,#9b3dbd)",
		q: "Is clientIn available now?",
		a: "We're putting the finishing touches on the app and it will be hitting the App Store and Google Play very soon. Follow us to be notified the moment it drops.",
	},
	{
		initial: "F",
		name: "Trial",
		color: "linear-gradient(135deg,#7a3e12,#c97b3a)",
		q: "Is there a free trial?",
		a: "Yes, every new business gets a full 30-day free trial with no credit card required. Full access from day one.",
	},
];

const COLLAPSED_W = 300;
const EXPANDED_W = 340;
const EXPANDED_H = 340;
// Collapsed: small tight bubbles on the left
const AVT_C = 32;
const OVERLAP_C = -8;
const SHOW_C = 4; // how many bubbles to show collapsed
// Expanded: bigger bubbles in a grid
const AVT_EX = 52;

export default function FAQ() {
	const [isExpanded, setIsExpanded] = useState(false);
	const [active, setActive] = useState<number | null>(null);

	function collapsedPos(i: number) {
		// Stack small bubbles from the left, hide overflow ones
		return {
			x: 12 + i * (AVT_C + OVERLAP_C),
			y: (60 - AVT_C) / 2, // vertically centred in 60px pill
			size: AVT_C,
			opacity: i < SHOW_C ? 1 : 0,
		};
	}

	function expandedPos(i: number) {
		const cols = 3;
		const colW = 90;
		const rowH = 100;
		const startX = (EXPANDED_W - cols * colW) / 2 + 10;
		const startY = 68;
		const col = i % cols;
		const row = Math.floor(i / cols);
		return { x: startX + col * colW, y: startY + row * rowH, size: AVT_EX, opacity: 1 };
	}

	const handleBubbleClick = (e: React.MouseEvent, i: number) => {
		e.stopPropagation();
		setActive(active === i ? null : i);
	};

	const activeFaq = active !== null ? faqs[active] : null;

	return (
		<section className="w-full mt-8 mb-8" aria-labelledby="faq-heading">
			{/* Section header */}
			<div className="text-center mb-10">
				<div
					className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold mb-4"
					style={{ background: "rgba(201,123,58,0.12)", color: "#c97b3a", border: "1px solid rgba(201,123,58,0.25)" }}
				>
					FAQ
				</div>
				<h2
					id="faq-heading"
					className="text-3xl sm:text-4xl font-extrabold"
					style={{ color: "var(--foreground)" }}
				>
					Questions? Answered.
				</h2>
				<p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
					{isExpanded ? "Tap any bubble to read the answer." : "Click to explore the FAQs."}
				</p>
			</div>

			{/* Pill + answer — centred column */}
			<div className="flex flex-col items-center gap-5">

				{/* Expanding pill */}
				<div
					onClick={() => { if (!isExpanded) setIsExpanded(true); }}
					className={cn(
						"relative transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
						!isExpanded && "cursor-pointer",
					)}
					style={{
						width: isExpanded ? EXPANDED_W : COLLAPSED_W,
						height: isExpanded ? EXPANDED_H : 60,
						borderRadius: isExpanded ? 24 : 999,
						background: "var(--card-bg)",
						border: "1px solid var(--card-border)",
						boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
						overflow: "visible",
					}}
				>          {/* Collapsed pill — label sits to the RIGHT of the bubble stack */}
          <div
            className={cn(
              "absolute inset-0 flex items-center pointer-events-none transition-opacity duration-300",
              isExpanded ? "opacity-0" : "opacity-100",
            )}
            style={{
              // push text past the bubble stack: 4 bubbles × (32-8)px + 12px start + padding
              paddingLeft: 12 + SHOW_C * (AVT_C + OVERLAP_C) + AVT_C + 10,
              paddingRight: 40,
            }}
          >
            <span className="text-sm font-semibold truncate" style={{ color: "var(--text-sub)" }}>
              Got questions?
            </span>
          </div>

					{/* Collapsed +N */}
					<div
						className={cn(
							"absolute flex items-center gap-0.5 text-xs font-medium transition-all duration-300",
							isExpanded ? "opacity-0 pointer-events-none" : "opacity-100",
						)}
						style={{ right: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
					>
						<span>+{faqs.length - 4}</span>
						<ChevronDown size={13} />
					</div>

					{/* Expanded header */}
					<div
						className={cn(
							"absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-4 pb-3 transition-all duration-500",
							isExpanded ? "opacity-100" : "opacity-0 pointer-events-none",
						)}
					>
						<div className="w-7" />
						<h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
							Pick a question
						</h3>
						<button
							onClick={(e) => { e.stopPropagation(); setIsExpanded(false); setActive(null); }}
							className="w-7 h-7 flex items-center justify-center rounded-full transition-colors"
							style={{ color: "var(--text-muted)" }}
							aria-label="Close"
						>
							<X size={15} />
						</button>
					</div>

					{/* Divider */}
					<div
						className={cn(
							"absolute left-4 right-4 h-px transition-opacity duration-500",
							isExpanded ? "opacity-100" : "opacity-0",
						)}
						style={{ top: 50, background: "var(--card-border)" }}
					/>

					{/* Bubbles */}
					{faqs.map((faq, i) => {
						const pos = isExpanded ? expandedPos(i) : collapsedPos(i);
						const delay = isExpanded ? i * 30 : (faqs.length - 1 - i) * 20;
						const isActive = active === i;

						return (              <div
                key={i}
                className="absolute transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                style={{
                  left: pos.x,
                  top: pos.y,
                  width: pos.size,
                  height: isExpanded ? pos.size + 22 : pos.size,
                  opacity: pos.opacity,
                  zIndex: isExpanded ? 1 : faqs.length - i,
                  transitionDelay: `${delay}ms`,
                  pointerEvents: pos.opacity === 0 ? "none" : "auto",
                }}
							>
								<div className="relative flex flex-col items-center">
									<button
										onClick={(e) => isExpanded && handleBubbleClick(e, i)}
										className={cn(
											"rounded-full flex items-center justify-center font-black text-white select-none",
											"transition-all duration-300 shadow-md",
											isExpanded ? "cursor-pointer hover:scale-110" : "pointer-events-none",
											isActive && "ring-2 ring-offset-2 ring-[#c97b3a] scale-110",
										)}
										style={{
											width: pos.size,
											height: pos.size,
											background: faq.color,
											fontSize: pos.size * 0.38,
										}}
										aria-label={faq.q}
									>
										{faq.initial}
									</button>

									{/* Name label */}
									<span
										className={cn(
											"absolute text-[11px] font-semibold whitespace-nowrap transition-all duration-500",
											isExpanded ? "opacity-100" : "opacity-0",
										)}
										style={{
											top: pos.size + 4,
											color: isActive ? "#c97b3a" : "var(--text-muted)",
											transitionDelay: isExpanded ? `${150 + i * 30}ms` : "0ms",
										}}
									>
										{faq.name}
									</span>
								</div>
							</div>
						);
					})}
				</div>

				{/* Answer card — slides in below when a bubble is tapped */}
				<div
					className={cn(
						"w-full transition-all duration-300",
						activeFaq
							? "opacity-100 translate-y-0 max-h-[300px]"
							: "opacity-0 -translate-y-1 max-h-0 overflow-hidden pointer-events-none",
					)}
					style={{ maxWidth: EXPANDED_W }}
				>
					{activeFaq && (
						<div
							className="rounded-2xl px-6 py-5 relative"
							style={{
								background: "var(--card-bg)",
								border: "1px solid var(--card-border)",
								boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
							}}
						>
							{/* Left accent bar */}
							<div
								className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
								style={{ background: activeFaq.color }}
							/>
							<button
								onClick={() => setActive(null)}
								className="absolute top-3 right-3 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
								style={{ color: "var(--text-muted)" }}
								aria-label="Close answer"
							>
								<X size={12} />
							</button>
							<p className="text-sm font-bold mb-2 pr-6" style={{ color: "var(--foreground)" }}>
								{activeFaq.q}
							</p>
							<p className="text-sm leading-relaxed" style={{ color: "var(--text-sub)" }}>
								{activeFaq.a}
							</p>
						</div>
					)}
				</div>

			</div>
		</section>
	);
}
