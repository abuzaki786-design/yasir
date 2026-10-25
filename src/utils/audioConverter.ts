// @ts-ignore
import lamejs from 'lamejs';

/**
 * Converts WAV byte array or base64 to MP3 Blob.
 */
export function convertWavToMp3(wavBuffer: ArrayBuffer): Blob {
  const dataView = new DataView(wavBuffer);

  // Validate RIFF header
  const isRiff =
    String.fromCharCode(
      dataView.getUint8(0),
      dataView.getUint8(1),
      dataView.getUint8(2),
      dataView.getUint8(3)
    ) === 'RIFF';

  let channels = 1;
  let sampleRate = 24000;
  let dataOffset = 44;

  if (isRiff && dataView.byteLength >= 44) {
    channels = dataView.getUint16(22, true) || 1;
    sampleRate = dataView.getUint32(24, true) || 24000;

    // Search for 'data' chunk
    let offset = 12;
    while (offset < dataView.byteLength - 8) {
      const chunkId = String.fromCharCode(
        dataView.getUint8(offset),
        dataView.getUint8(offset + 1),
        dataView.getUint8(offset + 2),
        dataView.getUint8(offset + 3)
      );
      const chunkSize = dataView.getUint32(offset + 4, true);
      if (chunkId === 'data') {
        dataOffset = offset + 8;
        break;
      }
      offset += 8 + chunkSize;
    }
  }

  // Extract Int16 samples
  const remainingBytes = wavBuffer.byteLength - dataOffset;
  const sampleCount = Math.floor(remainingBytes / 2);
  const samples = new Int16Array(wavBuffer, dataOffset, sampleCount);

  // Initialize Lame MP3 encoder
  const mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, 128); // 128kbps
  const mp3Chunks: Uint8Array[] = [];

  const sampleBlockSize = 1152;
  for (let i = 0; i < samples.length; i += sampleBlockSize) {
    const chunk = samples.subarray(i, Math.min(i + sampleBlockSize, samples.length));
    const mp3buf = mp3encoder.encodeBuffer(chunk);
    if (mp3buf && mp3buf.length > 0) {
      mp3Chunks.push(new Uint8Array(mp3buf));
    }
  }

  const endBuf = mp3encoder.flush();
  if (endBuf && endBuf.length > 0) {
    mp3Chunks.push(new Uint8Array(endBuf));
  }

  return new Blob(mp3Chunks as any, { type: 'audio/mp3' });
}

/**
 * Converts a base64-encoded WAV string into an MP3 Blob.
 */
export function base64WavToMp3Blob(base64Wav: string): Blob {
  const binaryString = atob(base64Wav);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return convertWavToMp3(bytes.buffer);
}
