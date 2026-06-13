#!/usr/bin/env python3
"""Word-level timestamps via vosk (offline ASR).

Usage:
    VOSK_MODEL=/path/to/vosk-model python3 scripts/asr_word_timings.py audio.mp3 out.json

Setup:
    python3 -m venv .venv && .venv/bin/pip install vosk
    curl -LO https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip && unzip

Output JSON ({duration, words:[{word,start,end}]}) feeds
scripts/build-sample-timings.ts and scripts/narration-sync-report.ts.
"""
import json
import os
import subprocess
import sys

from vosk import Model, KaldiRecognizer, SetLogLevel

SetLogLevel(-1)

audio_path = sys.argv[1]
out_path = sys.argv[2] if len(sys.argv) > 2 else None

# Vosk expects 16 kHz mono PCM; ffmpeg resamples arbitrary input formats.
SAMPLE_RATE = 16000
model = Model(os.environ.get("VOSK_MODEL", "/tmp/asr-env/vosk-model-small-en-us-0.15"))
rec = KaldiRecognizer(model, SAMPLE_RATE)
rec.SetWords(True)

proc = subprocess.run(
    ["ffmpeg", "-loglevel", "quiet", "-i", audio_path,
     "-ar", str(SAMPLE_RATE), "-ac", "1", "-f", "s16le", "-"],
    capture_output=True, check=True,
)
data = proc.stdout

words = []
# Feed audio in small chunks; AcceptWaveform returns True when a phrase completes.
chunk = 4000
for i in range(0, len(data), chunk):
    if rec.AcceptWaveform(data[i:i + chunk]):
        res = json.loads(rec.Result())
        words.extend(res.get("result", []))
res = json.loads(rec.FinalResult())
words.extend(res.get("result", []))

# Duration from raw PCM byte length (16-bit samples = 2 bytes per sample).
duration = len(data) / 2 / SAMPLE_RATE
result = {
    "duration": round(duration, 3),
    "words": [
        {"word": w["word"], "start": round(w["start"], 3), "end": round(w["end"], 3)}
        for w in words
    ],
}
out = json.dumps(result, indent=1)
if out_path:
    with open(out_path, "w") as f:
        f.write(out)
print(f"{len(result['words'])} words, duration {duration:.2f}s -> {out_path or 'stdout'}")
