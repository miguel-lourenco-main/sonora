import { Suspense } from 'react';
import VoicesTable from './_components/voices-table';
import VoicesLoading from './_components/loading';
import VoicesError from './_components/error';
import { getVoices } from '~/lib/actions';

export default function VoicesPage() {
    return (
        <div className="container py-6">
            <Suspense fallback={<VoicesLoading />}>
                <VoicesContent />
            </Suspense>
        </div>
    );
}

async function VoicesContent() {
    const voices = await getVoices() || [];
    
    return (
        <VoicesTable 
            initialVoices={voices}
        />
    );
}

export { VoicesError as error };