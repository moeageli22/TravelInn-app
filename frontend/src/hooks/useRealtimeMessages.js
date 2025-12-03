// frontend/src/hooks/useRealtimeMessages.js
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useRealtimeMessages(groupId) {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!groupId) return

        // Fetch initial messages
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('group_id', groupId)
                .order('created_at', { ascending: true })
                .limit(100)

            if (!error && data) {
                setMessages(data)
            }
            setLoading(false)
        }

        fetchMessages()

        // Subscribe to new messages
        const channel = supabase
            .channel(`group-${groupId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `group_id=eq.${groupId}`,
                },
                (payload) => {
                    console.log('New message received:', payload.new)
                    setMessages((current) => [...current, payload.new])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [groupId])

    return { messages, loading }
}