import { PricingTable } from "@clerk/nextjs";
import Image from "next/image";
import PaymentModalFix from "@/components/PaymentModalFix";

// Force dynamic rendering to avoid build-time Clerk validation errors
export const dynamic = 'force-dynamic';

const Subscription = () => {
    return (
        <main className="max-w-7xl mx-auto pb-12">
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

            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                    Choose Your Plan
                </h1>
                <p className="text-foreground-secondary text-lg max-w-2xl mx-auto">
                    Select the perfect plan for your learning journey. All plans include access to our AI companion library.
                </p>
            </div>

            {/* Payment Modal Fix Component */}
            <PaymentModalFix />

            {/* Pricing Table Container - Ensure it's visible and on top */}
            <div className="relative z-[100]">
                <PricingTable 
                    appearance={{
                        variables: {
                            colorPrimary: '#00CED1',
                            borderRadius: '12px',
                        },
                        elements: {
                            formButtonPrimary: 'bg-gradient-to-r from-cyan-400 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/30',
                            card: 'shadow-xl border border-border bg-card',
                            modalContent: 'z-[9999] !important',
                            modalBackdrop: 'z-[9998] !important',
                        }
                    }}
                />
            </div>

            {/* Additional Info */}
            <div className="mt-12 text-center">
                <p className="text-sm text-foreground-muted">
                    All plans are billed monthly. You can cancel or upgrade at any time.
                </p>
                <p className="text-sm text-foreground-muted mt-2">
                    Click "Subscribe" on any plan to proceed with payment. The payment screen will appear when you click Subscribe.
                </p>
            </div>
        </main>
    );
};
export default Subscription;
