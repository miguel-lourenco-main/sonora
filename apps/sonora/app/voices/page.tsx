import { Suspense } from 'react';
import VoicesTable from './_components/voices-table';
import VoicesLoading from './_components/loading';
import VoicesError from './_components/error';
import { ApiKeysSection } from './_components/api-keys-section';

export default function VoicesPage() {
    return (
        <div className="container py-6 size-full flex flex-col gap-6">
            <Suspense fallback={<VoicesLoading />}>
                <VoicesContent />
            </Suspense>
        </div>
    );
}

async function VoicesContent() {
    return (
        <>
            <ApiKeysSection />
            <VoicesTable 
                initialVoices={[]}
            />
        </>
    );
}

export { VoicesError as error };