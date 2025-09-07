import { Hero } from "./Hero";
import { Features } from "./Features";
import { BentoLayout } from "./BentoLayout";
import { CTA } from "./CTA";

export function HomePage() {
    return (
        <>
            <Hero />
            <BentoLayout />
            <Features />
            <CTA />
        </>
    );
}
