// supabase/functions/chatbot-ai/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai'

// Fungsi Supabase perlu Deno, jadi kita import cors seperti ini
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Inisialisasi Google AI
// Ambil API Key dari Environment Variables (Langkah 6)
const genAI = new GoogleGenerativeAI(Deno.env.get('GOOGLE_API_KEY')!)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

Deno.serve(async (req) => {
  // Handle preflight OPTIONS request untuk CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, user_role, user_id } = await req.json()

    // 1. Buat Supabase client KHUSUS untuk backend
    //    Ini menggunakan service_role key untuk bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    let contextString = ''
    let systemPrompt = ''

    // 2. Kumpulkan Konteks dari DB berdasarkan Role
    if (user_role === 'buyer') {
      const { data: products, error } = await supabaseAdmin
        .from('products')
        .select('name, description, category, price')

      if (error) throw new Error(`Supabase product fetch error: ${error.message}`)

      systemPrompt = `
        Anda adalah "LarisAsisten", asisten belanja AI untuk marketplace UMKM "LARISMANIS".
        Tugas Anda adalah membantu pembeli menemukan produk.
        Selalu jawab dalam Bahasa Indonesia yang ramah.
        Gunakan daftar produk ini sebagai konteks Anda. JANGAN mengarang produk.
        Konteks Produk: ${JSON.stringify(products)}
      `
    } else if (user_role === 'seller') {
      // Cari storeId milik penjual ini
      const { data: store, error: storeError } = await supabaseAdmin
        .from('stores')
        .select('id')
        .eq('owner_id', user_id)
        .single()

      if (storeError || !store) {
        systemPrompt = `Anda adalah asisten "Manajer Toko". Katakan pada penjual bahwa mereka harus membuat toko terlebih dahulu sebelum Anda bisa memberi data.`
      } else {
        // Ambil data penjualan (orders) HANYA untuk toko ini
        const { data: orders, error } = await supabaseAdmin
          .from('orders')
          .select('total_amount, status, created_at')
          .eq('store_id', store.id)

        if (error) throw new Error(`Supabase order fetch error: ${error.message}`)

        systemPrompt = `
          Anda adalah asisten "Manajer Toko" untuk penjual di "LARISMANIS".
          Tugas Anda adalah menjawab pertanyaan bisnis penjual.
          Selalu jawab dalam Bahasa Indonesia yang analitis.
          Gunakan data penjualan ini sebagai sumber kebenaran. JANGAN mengarang data.
          Data Penjualan Toko Ini: ${JSON.stringify(orders)}
        `
      }
    }

    // 3. Panggil Google AI
    const fullPrompt = `${systemPrompt}\n\nPERTANYAAN PENGGUNA:\n${message}`
    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const text = response.text()

    return new Response(JSON.stringify({ reply: text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})