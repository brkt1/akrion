import { supabase } from '../supabase'

export const authAPI = {
  // Sign up a new user
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) {
      console.error('Error signing up:', error)
      throw error
    }
    return data
  },

  // Sign in existing user
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      console.error('Error signing in:', error)
      throw error
    }
    return data
  },

  // Send a secure password setup/recovery link back to the admin setup page.
  // The destination must also be allow-listed in Supabase Auth URL settings.
  async requestPasswordSetup(email) {
    const redirectTo = `${window.location.origin}/admin/setup-password`
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })

    if (error) {
      console.error('Error requesting password setup:', error)
      throw error
    }
    return data
  },

  // Password changes are performed only inside an authenticated invite or
  // recovery session. The password never passes through application storage.
  async updatePassword(password) {
    const { data, error } = await supabase.auth.updateUser({ password })

    if (error) {
      console.error('Error updating password:', error)
      throw error
    }
    return data
  },

  // Sign out current user
  async signOut() {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Error signing out:', error)
      throw error
    }
    return true
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Error getting session:', error)
      throw error
    }
    return session
  },

  // Get current user
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error getting user:', error)
      throw error
    }
    return user
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session)
    })
  },

  // Check if current user is an admin
  async isAdmin() {
    try {
      const user = await this.getUser()
      return this.isAdminUser(user)
    } catch (err) {
      return false
    }
  },

  // Roles used for authorization must be stored in server-controlled
  // app_metadata. user_metadata can be edited by the signed-in user and is
  // intentionally never accepted as an admin claim.
  isAdminUser(user) {
    return user?.app_metadata?.role === 'admin'
  },
}

