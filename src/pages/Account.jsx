import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MinimalBadge } from "@/components/ui/minimal-badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setError(null);
    } catch (err) {
      console.error('Error loading user:', err);
      // Fix #1: If not logged in, redirect to login
      if (err.message?.includes('Unauthorized') || err.message?.includes('not authenticated') || err.status === 401) {
        await User.loginWithRedirect(window.location.href);
        return; // Stop execution after redirect
      }
      setError('Failed to load account information. Please try again.');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <MinimalBadge variant="info" size="sm">Active</MinimalBadge>;
      case 'trial':
        return <MinimalBadge variant="neutral" size="sm">Trial</MinimalBadge>;
      case 'expired':
        return <MinimalBadge variant="warning" size="sm">Expired</MinimalBadge>;
      case 'cancelled':
        return <MinimalBadge variant="neutral" size="sm">Cancelled</MinimalBadge>;
      default:
        return <MinimalBadge variant="neutral" size="sm">Unknown</MinimalBadge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--go-bg)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--go-bg)] flex items-center justify-center px-4">
        <Card className="go-panel shadow-none  max-w-md w-full">
          <CardContent className="p-6 text-center">
            <div className="text-sm text-[color:var(--go-error)] mb-4">{error}</div>
            <Button onClick={loadUser} className="h-8 go-pill-btn">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fix #2: Prevent negative days by using Math.max(0, ...)
  const daysUntilExpiration = user?.subscription_expires 
    ? Math.max(0, Math.ceil((new Date(user.subscription_expires) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="min-h-screen bg-[var(--go-bg)] py-5 md:py-6">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5"
        >
          <h1 className="go-page-title">
            Account Settings
          </h1>
          <p className="go-page-subtitle mt-1.5">
            Subscription and account details
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Account Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="go-panel shadow-none ">
                <CardHeader className="border-b border-[color:var(--go-border)]">
                  <CardTitle className="text-[12px] font-medium text-[color:var(--go-text-secondary)]">
                    Account Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-sm text-[color:var(--go-text-secondary)] mb-2">Access Level</div>
                      <div className="text-xl font-bold text-[color:var(--go-text)]">
                        Full Access
                      </div>
                    </div>
                    <MinimalBadge variant="info" size="sm">Free</MinimalBadge>
                  </div>

                  <div className="bg-[var(--go-accent-soft)] border border-[color:var(--go-accent-border)] rounded-lg p-4">
                    <div className="text-[13px] text-[color:var(--go-accent-text)] font-medium mb-2">
                      Free for All Users
                    </div>
                    <div className="text-[13px] text-[color:var(--go-text-body)]">
                      Enjoy unlimited access to all features at no cost
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Account Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="go-panel shadow-none ">
                <CardHeader className="border-b border-[color:var(--go-border)]">
                  <CardTitle className="text-[12px] font-medium text-[color:var(--go-text-secondary)]">
                    Account Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <div className="text-xs text-[color:var(--go-text-muted)] mb-1">Name</div>
                    <div className="text-sm text-[color:var(--go-text)]">{user?.full_name || 'Not provided'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[color:var(--go-text-muted)] mb-1">Email</div>
                    <div className="text-sm text-[color:var(--go-text)]">{user?.email}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[color:var(--go-text-muted)] mb-1">Role</div>
                    <div className="text-sm text-[color:var(--go-text)] capitalize">{user?.role || 'user'}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="go-panel shadow-none ">
                <CardHeader className="border-b border-[color:var(--go-border)]">
                  <CardTitle className="text-[12px] font-medium text-[color:var(--go-text-secondary)]">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-xs text-[color:var(--go-text-secondary)] hover:text-[color:var(--go-text)]"
                    onClick={() => User.logout()}
                  >
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}