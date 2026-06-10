"use client"
import axios from "axios"
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { span } from "motion/react-client"
import { Span } from "next/dist/trace"

interface DashboardProps {
    ownerId?: string; // Made optional to prevent crashes if parent fails to pass it
}

function DashboardClient({ ownerId }: DashboardProps) {
    const router = useRouter()
    const [businessName, setBusinessName] = useState("")
    const [supportEmail, setsupportEmail] = useState("")
    const [knowledge, setknowledge] = useState("")
    const [loading, setLoading] = useState(false)

    const activeOwnerId = ownerId || "mock_owner_123"
    const [saved, setsaved]=useState(false)

    const handlesettings = async () => {
        // Client-side guard check
        if (!activeOwnerId) {
            console.error("❌ Cannot save settings: Owner ID is completely missing.")
            alert("Error: User session could not be verified.")
            return
        }

        try {
            setLoading(true)
            setsaved(true)
            setTimeout(()=> setsaved(false),3000)
            console.log("Sending payload to backend:", { 
                ownerId: activeOwnerId, 
                businessName, 
                supportEmail, 
                knowledge 
            })

            const result = await axios.post("/api/settings", { 
                ownerId: activeOwnerId, 
                businessName, 
                supportEmail, 
                knowledge 
            })

            console.log("🚀 Settings saved successfully:", result.data)
            alert("Settings saved successfully!")
        } catch (error: any) {
            console.error("❌ API Response Error:", error.response?.data || error.message)
            alert(`Failed to save: ${error.response?.data?.message || "Internal Server Error"}`)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
    if (ownerId) {
        const handleGetDetails = async () => {
            try {
                const result = await axios.post("/api/settings/get", { ownerId }); 
                
                if (result.data) {
                    setBusinessName(result.data.businessName || "");
                    setsupportEmail(result.data.supportEmail || "");
                    setknowledge(result.data.knowledge || "");
                }
            } catch (error) {
                console.error("Failed to fetch initial settings:", error);
            }
        };
        handleGetDetails();
    }
}, [ownerId]);
    return (
        <div className='min-h-screen bg-zinc-50 text-zinc-900'>
            <motion.div
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className='fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-200'
            >
                <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
                    <div 
                        className='text-lg font-semibold tracking-tight cursor-pointer select-none'
                        onClick={() => router.push("/")}
                    >
                        Support <span className='text-zinc-400'>AI</span>
                    </div>
                    
                    <button 
                        type="button"
                        className="px-4 py-2 rounded-xl border border-zinc-300 text-sm font-medium hover:bg-zinc-100 transition shadow-sm bg-white"
                        onClick={() => alert("Embed modal functionality can be added here!")}
                    >
                        Embed ChatBot
                    </button>
                </div>
            </motion.div>
            
            <div className='max-w-3xl mx-auto px-6 pt-28 pb-16'>
                
                <div className='mb-10'>
                    <h1 className='text-2xl font-semibold tracking-tight'>ChatBot Settings</h1>
                    <p className='text-zinc-500 mt-1 text-sm'>
                        Manage your AI chatbot knowledge and business details.
                    </p>
                </div>

                <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-10">
                    
                    <div>
                        <h1 className='text-base font-medium mb-4 text-zinc-800'>Business Details</h1>
                        <div className='space-y-4'>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-zinc-500 pl-1">Business Name</label>
                                <input 
                                    type="text" 
                                    className='w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80 transition' 
                                    placeholder='e.g., Apna Mart' 
                                    onChange={(e) => setBusinessName(e.target.value)} 
                                    value={businessName}
                                />
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-zinc-500 pl-1">Support Email</label>
                                <input 
                                    type="email" 
                                    className='w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80 transition' 
                                    placeholder='e.g., support@apnamart.com' 
                                    onChange={(e) => setsupportEmail(e.target.value)} 
                                    value={supportEmail}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h1 className='text-base font-medium mb-1 text-zinc-800'>Knowledge Base</h1>
                        <p className='text-xs text-zinc-500 mb-4'>
                            Add FAQs, policies, delivery info, refunds, etc.
                        </p>
                        
                        <div className='space-y-4'>
                            <textarea 
                                className='w-full h-48 rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80 transition resize-none leading-relaxed' 
                                placeholder={`Example:\n• Refund policy: 7 days return available\n• Delivery time: 3-5 working days\n• Cash on Delivery available\n• Support hours`} 
                                onChange={(e) => setknowledge(e.target.value)} 
                                value={knowledge}
                            />
                        </div>
                    </div>
                    
                    <div className='flex items-center justify-end border-t border-zinc-100 pt-6'>
                        <motion.button
                            whileHover={!loading ? { scale: 1.02 } : {}}
                            whileTap={!loading ? { scale: 0.98 } : {}}
                            disabled={loading}
                            onClick={handlesettings}
                            className="px-8 py-3 rounded-xl bg-black text-white text-sm font-medium hover:bg-zinc-800 transition disabled:opacity-60 shadow-sm"
                        >
                            {loading ? "Saving Changes..." : "Save Changes"}
                        </motion.button>
                        {saved && <motion.span
                        initial={{opacity:0, y:6}}
                        animate={{opacity:1, y:0}}
                        className="text-sm font-medium,text-emerald-600"
                        >
                           setting saved </motion.span>}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default DashboardClient;