import { supabase } from './supabase'

export const chatService = {
  // Save chat message with improved error handling
  async saveMessage(sessionId, userId, userMessage, aiResponse) {
    try {
      const chatData = {
        session_id: sessionId,
        user_id: userId || 'anonymous',
        user_message: userMessage.substring(0, 1000), // Limit message length
        ai_response: aiResponse.substring(0, 1000), // Limit response length
        created_at: new Date().toISOString()
      }

      console.log('📝 Saving chat to Supabase:', { 
        sessionId, 
        userId, 
        messageLength: userMessage.length 
      })

      const { data, error } = await supabase
        .from('chat_messages')
        .insert([chatData])
        .select()

      if (error) {
        console.error('❌ Supabase chat save error:', error)
        throw new Error(`Failed to save chat: ${error.message}`)
      }

      console.log('✅ Chat saved successfully:', data[0].id)
      return {
        success: true,
        message: data[0],
        id: data[0].id
      }
    } catch (error) {
      console.error('❌ Chat service error:', error)
      return {
        success: false,
        error: error.message,
        message: 'Failed to save chat message'
      }
    }
  },

  // Get chat history for session
  async getChatHistory(sessionId) {
    try {
      console.log('📋 Fetching chat history for session:', sessionId)
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('❌ Error fetching chat history:', error)
        throw new Error(`Failed to fetch chat history: ${error.message}`)
      }

      console.log(`✅ Found ${data.length} chat messages`)
      return {
        success: true,
        messages: data,
        count: data.length
      }
    } catch (error) {
      console.error('❌ Chat history error:', error)
      return {
        success: false,
        error: error.message,
        messages: [],
        count: 0
      }
    }
  },

  // Get all chats (admin) with pagination
  async getAllChats(limit = 50, page = 1) {
    try {
      const from = (page - 1) * limit
      const to = from + limit - 1

      console.log('📊 Fetching all chats:', { limit, page })

      const { data, error, count } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) {
        console.error('❌ Error fetching all chats:', error)
        throw new Error(`Failed to fetch chats: ${error.message}`)
      }

      console.log(`✅ Found ${data.length} chats (total: ${count})`)
      return {
        success: true,
        chats: data,
        total: count || 0,
        page,
        limit,
        hasMore: (count || 0) > to + 1
      }
    } catch (error) {
      console.error('❌ Get all chats error:', error)
      return {
        success: false,
        error: error.message,
        chats: [],
        total: 0
      }
    }
  },

  // Delete chat message (admin only)
  async deleteMessage(messageId) {
    try {
      console.log('🗑️ Deleting chat message:', messageId)
      
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId)

      if (error) {
        console.error('❌ Error deleting chat:', error)
        throw new Error(`Failed to delete chat: ${error.message}`)
      }

      console.log('✅ Chat message deleted')
      return { success: true }
    } catch (error) {
      console.error('❌ Delete chat error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Get chat statistics
  async getChatStats() {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('created_at, session_id')

      if (error) throw error

      const today = new Date().toISOString().split('T')[0]
      const todayChats = data.filter(chat => 
        chat.created_at.startsWith(today)
      ).length

      const uniqueSessions = [...new Set(data.map(chat => chat.session_id))].length

      return {
        success: true,
        totalChats: data.length,
        todayChats,
        uniqueSessions,
        avgMessagesPerSession: data.length / (uniqueSessions || 1)
      }
    } catch (error) {
      console.error('❌ Chat stats error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// Helper function to generate session ID
export const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}