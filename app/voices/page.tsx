import { Suspense } from 'react';
import VoicesLoading from './_components/loading';
import VoicesError from './_components/error';
import { VoicesContent } from './_components/voices-content';

export default function VoicesPage() {
    return (
        <div className="container py-6 size-full flex flex-col gap-6">
            <Suspense fallback={<VoicesLoading />}>
                <VoicesContent />
            </Suspense>
        </div>
    );
}

export { VoicesError as error };