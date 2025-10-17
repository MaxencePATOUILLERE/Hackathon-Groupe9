import {Header} from "@/components/header";
import {Top} from "@/components/top";
import {Features} from "@/components/feature";
import {LiveMatches} from "@/components/live-match";
import {Stats} from "@/components/stat";
import {CTA} from "@/components/cta";

export default function HomePage() {
    return (
        <main className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />

            <section className="py-10 px-6 md:px-12">
                <Top />
            </section>

            <section className="py-10 px-6 md:px-12 bg-muted/30">
                <Features />
            </section>

            <section className="py-10 px-6 md:px-12">
                <LiveMatches />
            </section>

            {/* Statistiques globales */}
            <section className="py-10 px-6 md:px-12 bg-muted/40">
                <Stats />
            </section>

            {/* Appel à l’action (CTA) */}
            <section className="py-10 px-6 md:px-12">
                <CTA />
            </section>
        </main>
    )
}