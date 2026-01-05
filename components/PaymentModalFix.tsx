"use client";

import { useEffect } from "react";

const PaymentModalFix = () => {
    useEffect(() => {
        // Inject styles to ensure payment modal is visible
        const style = document.createElement('style');
        style.id = 'payment-modal-fix';
        style.textContent = `
            .cl-pricingTable {
                position: relative !important;
                z-index: 100 !important;
            }
            .cl-modalContent,
            .cl-modalContentWrapper,
            [data-clerk-modal] {
                z-index: 9999 !important;
                position: fixed !important;
            }
            .cl-modalBackdrop,
            [data-clerk-modal-backdrop] {
                z-index: 9998 !important;
                position: fixed !important;
            }
            .cl-pricingTableModal {
                z-index: 9999 !important;
            }
            /* Ensure all Clerk payment modals are visible */
            [role="dialog"] {
                z-index: 9999 !important;
            }
            /* Fix for Clerk checkout modal */
            iframe[src*="clerk"] {
                z-index: 9999 !important;
            }
        `;
        document.head.appendChild(style);

        // Also ensure modals are visible when they appear
        const observer = new MutationObserver(() => {
            const modals = document.querySelectorAll('[role="dialog"], .cl-modalContent, [data-clerk-modal]');
            modals.forEach((modal) => {
                const element = modal as HTMLElement;
                element.style.zIndex = '9999';
                element.style.position = 'fixed';
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        return () => {
            const styleElement = document.getElementById('payment-modal-fix');
            if (styleElement) {
                document.head.removeChild(styleElement);
            }
            observer.disconnect();
        };
    }, []);

    return null;
};

export default PaymentModalFix;

