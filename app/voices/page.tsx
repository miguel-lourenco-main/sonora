import { Suspense } from 'react';
import VoicesLoading from './_components/loading';
import VoicesError from './_components/error';
import { VoicesContent } from './_components/voices-content';

export default function VoicesPage() {
    return (
        <Suspense fallback={<VoicesLoading />}>
            <VoicesContent />
        </Suspense>
    );
}

export { VoicesError as error };
