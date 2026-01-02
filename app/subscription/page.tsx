import { PricingTable } from "@clerk/nextjs";
import Image from "next/image";

// Force dynamic rendering to avoid build-time Clerk validation errors
export const dynamic = 'force-dynamic';

const Subscription = () => {
    return (
        <main>
            {/* Logo */}
            <div className="mb-8 flex justify-center pt-8">
                <Image
                    src="/images/amro-ai-academy/amro-ai-academy-logo.png"
                    alt="AMRO Academy"
                    width={140}
                    height={50}
                    className="object-contain h-12 w-auto"
                    unoptimized
                />
            </div>

            <PricingTable />
        </main>
    );
};
export default Subscription;
