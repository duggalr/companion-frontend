import { useRouter } from 'next/navigation';
import ShimmerButton from "@/components/ui/shimmer-button";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import SparklesText from "@/components/ui/sparkles-text";
// import { BackgroundBeams } from "../ui/background-beams";
// import RetroGrid from "@/components/ui/retro-grid";
// import { WavyBackground } from "../ui/wavy-background";
// import { BackgroundLines } from "../ui/background-lines";


export default function HeroPrimary() {

    const router = useRouter();
    const handleVisitIDEClick = () => {
        router.push('/playground');
    };

    return (

        <section className="min-h-screen flex flex-col items-center py-16 px-4">

            <div class="absolute bottom-1/3 left-16 -rotate-12">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="50" height="50">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m6 0h3" />
                </svg>
            </div>

            <div class="absolute top-1/4 right-24 rotate-12">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
            </div>

            <div className="max-w-5xl mx-auto text-center mt-0 "> {/* Added margin to avoid overlap with Navbar */}
                
                {/* <h1 className="scroll-m-20 text-[49px] font-bold tracking-tight mt-0">
                    Online REPL with an AI Tutor
                </h1> */}
                <SparklesText text="Online REPL with an AI Tutor" />

                <p className="text-[20px] text-muted-foreground pt-4 tracking-wide">
                    An interactive Python code editor combined with an AI tutor that guides your thinking at every step.
                </p>

                <div className="mt-6 flex items-center justify-center">
                    <ShimmerButton className="shadow-2xl" onClick={handleVisitIDEClick}>
                        <span
                            className="whitespace-pre-wrap text-center text-lg font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10"
                        >
                            Visit IDE &nbsp; &#8594;
                        </span>
                    </ShimmerButton>
                </div>

                <div className="relative mt-8">
                    <HeroVideoDialog
                        className="dark:hidden block"
                        animationStyle="from-center"
                        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                        thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
                        thumbnailAlt="Hero Video"
                    />
                    <HeroVideoDialog
                        className="hidden dark:block"
                        animationStyle="from-center"
                        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                        thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
                        thumbnailAlt="Hero Video"
                    />
                </div>

            </div>

        </section>
        
    );
}