import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient'; // Pastikan path ini benar

// Tipe untuk setiap pesan dalam chat
interface Message {
    sender: 'user' | 'bot';
    text: string;
}

/**
 * Komponen Chatbot AI
 * Tampil sebagai floating button dan membuka jendela chat.
 * Hanya tampil jika user sudah login.
 */
export const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Ambil user DAN session dari AuthContext
    const { user, session } = useAuth();

    // Tambahkan pesan sapaan awal hanya sekali saat komponen dimuat
    useEffect(() => {
        if (user && messages.length === 0) {
            setMessages([
                {
                    sender: 'bot',
                    text: `Halo ${user.name}! Ada yang bisa saya bantu seputar ${user.role === 'buyer' ? 'produk' : 'toko Anda'}?`
                }
            ]);
        }
    }, [user, messages.length]); // Ditambahkan messages.length agar tidak reset

    /**
     * Mengirim pesan ke Supabase Edge Function 'chatbot-ai'
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Ambil token JWT dari sesi. Ini penting untuk autentikasi.
            const token = session?.access_token;

            if (!token || !user) {
                setMessages((prev) => [
                    ...prev,
                    { sender: 'bot', text: 'Maaf, Anda harus login untuk menggunakan asisten AI.' },
                ]);
                setIsLoading(false);
                return;
            }

            // Panggil Supabase Edge Function yang sudah Anda deploy

            // ===== PERBAIKAN DI SINI =====
            // Tipe 'data' harus bisa 'null' jika terjadi error
            const { data, error }: { data: { reply?: string, error?: string } | null, error: any } = await supabase.functions.invoke('chatbot-ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: input,
                    user_role: user.role, // Kirim role
                    user_id: user.id      // Kirim id
                }),
            });
            // =============================

            // Tangani jika function-nya sendiri error
            if (error) {
                throw new Error(error.message);
            }

            // Tangani jika ada error logis DARI DALAM function (didefinisikan di Edge Function)
            // Periksa 'data' dulu sebelum akses 'data.error'
            if (data && data.error) {
                throw new Error(data.error);
            }

            const botMessage: Message = {
                sender: 'bot',
                text: data?.reply || "Maaf, saya tidak mengerti." // Gunakan data?.reply
            };
            setMessages((prev) => [...prev, botMessage]);

        } catch (error: any) {
            const errorMessage: Message = {
                sender: 'bot',
                text: `Maaf, terjadi kesalahan: ${error.message}`,
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Tampilkan chatbot hanya jika pengguna sudah login
    if (!user) {
        return null;
    }

    // Render UI
    return (
        <>
            {/* Tombol Floating */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg z-50 hover:scale-110 transition-transform"
                    aria-label="Buka Asisten AI"
                >
                    <MessageSquare size={28} />
                </button>
            )}

            {/* Jendela Chat */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-xl z-50 flex flex-col animate-scale-in">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 flex justify-between items-center rounded-t-2xl">
                        <h3 className="font-bold">LarisAsisten AI</h3>
                        <button
                            aria-label="Tutup Chat"
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 p-1 rounded-full"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Area Pesan */}
                    <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'bot' && <Bot className="w-5 h-5 text-blue-600 flex-shrink-0" />}
                                <div
                                    className={`max-w-[80%] px-3 py-2 rounded-lg break-words ${msg.sender === 'user'
                                            ? 'bg-blue-100 text-blue-900 rounded-br-none'
                                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                                {msg.sender === 'user' && <User className="w-5 h-5 text-gray-600 flex-shrink-0" />}
                            </div>
                        ))}
                        {/* Tampilkan indikator loading saat bot "mengetik" */}
                        {isLoading && (
                            <div className="flex justify-start gap-2">
                                <Bot className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                <div className="px-3 py-2 rounded-lg bg-gray-100 text-gray-800 rounded-bl-none">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Form */}
                    <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ketik pesan..."
                            className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                        <button
                            type="submit"
                            aria-label="Kirim Pesan"
                            disabled={isLoading}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};