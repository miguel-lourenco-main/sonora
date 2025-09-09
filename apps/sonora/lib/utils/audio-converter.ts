export async function convertAudioToWav(audioBlob: Blob): Promise<Blob> {
    // Create an audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create an audio buffer from the blob
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // Create offline context for rendering
    const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
    );
    
    // Create buffer source
    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineContext.destination);
    source.start();
    
    // Render audio
    const renderedBuffer = await offlineContext.startRendering();
    
    // Convert to WAV format
    const wavBlob = await new Promise<Blob>((resolve) => {
        const length = renderedBuffer.length * renderedBuffer.numberOfChannels * 2;
        const view = new DataView(new ArrayBuffer(44 + length));
        
        // WAV header
        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + length, true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, renderedBuffer.numberOfChannels, true);
        view.setUint32(24, renderedBuffer.sampleRate, true);
        view.setUint32(28, renderedBuffer.sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(view, 36, 'data');
        view.setUint32(40, length, true);
        
        // Audio data
        const data = new Float32Array(renderedBuffer.length * renderedBuffer.numberOfChannels);
        let offset = 0;
        for (let i = 0; i < renderedBuffer.numberOfChannels; i++) {
            data.set(renderedBuffer.getChannelData(i), offset);
            offset += renderedBuffer.length;
        }
        
        // Convert to 16-bit PCM
        const pcmData = new Int16Array(data.length);
        for (let i = 0; i < data.length; i++) {
            const s = Math.max(-1, Math.min(1, data[i] ?? 0));
            pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        
        const pcmDataView = new DataView(pcmData.buffer);
        for (let i = 0; i < pcmData.length; i++) {
            view.setInt16(44 + i * 2, pcmDataView.getInt16(i * 2, true), true);
        }
        
        resolve(new Blob([view], { type: 'audio/wav' }));
    });
    
    return wavBlob;
}

function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
} 