import { NextRequest } from "next/server";

// Simulasi respons kalimat yang akan distream kata per kata
const SAMPLE_RESPONSES = [
  "Tentu! Saya adalah asisten AI yang sekarang menggunakan streaming real-time. Setiap kata yang Anda baca ini dikirimkan langsung dari server saat dibuat, tanpa harus menunggu seluruh paragraf selesai diproses.",
  "Halo! Dengan fungsi streaming, Time-to-First-Token (TTFT) menjadi sangat cepat. Pengalaman chatting terasa jauh lebih hidup dan interaktif seperti berbicara dengan manusia sungguhan.",
  "Baik, ini adalah contoh pengiriman data per kata secara berurutan. Server membuka pipa streaming (ReadableStream) dan mengalirkan potongan kata secara berkala ke browser Anda."
];

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    // Pilih respons atau buat jawaban dinamis berdasarkan pesan user
    const textToStream = message 
      ? `Anda baru saja mengatakan: "${message}". ` + SAMPLE_RESPONSES[0]
      : SAMPLE_RESPONSES[1];

    // Pecah teks menjadi kata-kata (token) untuk dikirim bertahap
    const words = textToStream.split(" ");

    // Buat Web Standard ReadableStream
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        for (let i = 0; i < words.length; i++) {
          // Cek apakah client membatalkan koneksi (barge-in / cancel)
          if (req.signal.aborted) {
            console.log("Client membatalkan stream (interupsi). Menghentikan loop.");
            controller.close();
            return;
          }

          // Kirim kata saat ini + spasi
          const chunk = words[i] + (i === words.length - 1 ? "" : " ");
          controller.enqueue(encoder.encode(chunk));

          // Jeda simulasi waktu berpikir/generate LLM (misal: 40ms per kata)
          await new Promise((resolve) => setTimeout(resolve, 40));
        }

        // Tutup aliran setelah semua kata terkirim
        controller.close();
      },
      cancel() {
        console.log("Stream dibatalkan oleh reader client.");
      },
    });

    // Return response dengan header streaming yang tepat
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error pada streaming chat API:", error);
    return new Response(JSON.stringify({ error: "Gagal memproses streaming" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
