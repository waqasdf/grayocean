import React, { useState, useEffect } from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { db } from '@/api/localClient';

import { MinimalBadge } from '@/components/ui/minimal-badge';
import { MessageSquare, ThumbsUp, Send, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment';

export default function ForumPage() {
  const [message, setMessage] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [topic, setTopic] = useState('general');
  const [filterTopic, setFilterTopic] = useState('all');
  const [replyingTo, setReplyingTo] = useState(null);
  const [upvotedPosts, setUpvotedPosts] = useState(new Set());
  const queryClient = useQueryClient();

  useEffect(() => {
    const savedName = localStorage.getItem('forum-author-name');
    if (savedName) setAuthorName(savedName);
    
    const savedUpvotes = localStorage.getItem('forum-upvoted-posts');
    if (savedUpvotes) {
      setUpvotedPosts(new Set(JSON.parse(savedUpvotes)));
    }
  }, []);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['forum-posts'],
    queryFn: () => db.entities.ForumPost.list('-created_date', 100),
    refetchInterval: 5000,
  });

  const createPostMutation = useMutation({
    mutationFn: (postData) => db.entities.ForumPost.create(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      setMessage('');
      setReplyingTo(null);
    },
  });

  const handleUpvote = (postId, currentUpvotes) => {
    const isAlreadyUpvoted = upvotedPosts.has(postId);
    const newUpvotes = isAlreadyUpvoted ? Math.max(0, currentUpvotes - 1) : currentUpvotes + 1;
    
    db.entities.ForumPost.update(postId, { upvotes: newUpvotes }).then(() => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      const newUpvoted = new Set(upvotedPosts);
      if (isAlreadyUpvoted) {
        newUpvoted.delete(postId);
      } else {
        newUpvoted.add(postId);
      }
      setUpvotedPosts(newUpvoted);
      localStorage.setItem('forum-upvoted-posts', JSON.stringify(Array.from(newUpvoted)));
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || !authorName.trim()) return;

    localStorage.setItem('forum-author-name', authorName);

    createPostMutation.mutate({
      message: message.trim(),
      author_name: authorName.trim(),
      topic: replyingTo ? posts.find(p => p.id === replyingTo)?.topic || 'general' : topic,
      parent_id: replyingTo || undefined,
      upvotes: 0
    });
  };

  const filteredPosts = posts.filter(post => {
    if (filterTopic === 'all') return true;
    return post.topic === filterTopic;
  });

  const topLevelPosts = filteredPosts.filter(post => !post.parent_id);
  const getReplies = (postId) => filteredPosts.filter(post => post.parent_id === postId);

  const topicColors = {
    general: 'info',
    ssn_analysis: 'info',
    address_intel: 'info',
    skiptrace: 'success',
    support: 'warning',
    feedback: 'neutral'
  };

  const topicLabels = {
    general: 'General',
    ssn_analysis: 'SSN Analysis',
    address_intel: 'Address Intel',
    skiptrace: 'Skiptrace',
    support: 'Support',
    feedback: 'Feedback'
  };

  return (
    <div className="min-h-screen bg-[var(--go-bg)]">
      {/* Page header */}
      <div className="border-b border-[color:var(--go-border)] bg-[var(--go-bg)]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-5 md:py-6">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="go-page-title">Community Forum</h1>
                <p className="go-page-subtitle mt-1.5">Ask questions and share notes</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[color:var(--go-border)] bg-[var(--go-bg-panel)]">
                <div className="w-1 h-1 rounded-full bg-[var(--go-success)]" />
                <span className="text-[12px] text-[color:var(--go-text-muted)]">{posts.length} posts</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-5 py-5 md:py-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="go-panel shadow-none">
            <CardHeader className="border-b border-[color:var(--go-border)] px-4 py-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[12px] font-medium text-[color:var(--go-text-secondary)] flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {replyingTo ? 'Post Reply' : 'New Post'}
                </h2>
                {replyingTo && (
                  <MinimalBadge variant="info" size="xs">
                    Replying to thread
                  </MinimalBadge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <Input
                    placeholder="Your name"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="bg-[var(--go-bg-panel)] border-[color:var(--go-border)] text-[color:var(--go-text)] placeholder:text-[color:var(--go-text-muted)] md:w-48 flex-shrink-0"
                  />
                  {!replyingTo && (
                    <div className="flex flex-wrap gap-2 items-center">
                      {Object.entries(topicLabels).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setTopic(key)}
                          className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all border ${
                            topic === key
                              ? 'bg-[var(--go-accent-soft)] border-[color:var(--go-accent-border)] text-[color:var(--go-accent-text)]'
                              : 'bg-[var(--go-bg-panel)] border-[color:var(--go-border)] text-[color:var(--go-text-muted)] hover:text-[color:var(--go-text-body)] hover:border-white/20'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Textarea
                  placeholder="Share your thoughts..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-[var(--go-bg-panel)] border-[color:var(--go-border)] text-[color:var(--go-text)] placeholder:text-[color:var(--go-text-muted)] min-h-24"
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={createPostMutation.isPending || !message.trim() || !authorName.trim()}
                    className="bg-white/10 hover:bg-white/20 text-[color:var(--go-text)] border border-white/20"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {createPostMutation.isPending ? 'Posting...' : 'Post'}
                  </Button>
                  {replyingTo && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setReplyingTo(null)}
                      className="border-[color:var(--go-border)]"
                    >
                      Cancel Reply
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[color:var(--go-text-muted)]">Filter:</span>
          {['all', ...Object.keys(topicLabels)].map((key) => (
            <button
              key={key}
              onClick={() => setFilterTopic(key)}
              className={`px-3 py-1 rounded-lg text-[12px] font-medium transition-all border ${
                filterTopic === key
                  ? 'bg-[var(--go-accent-soft)] border-[color:var(--go-accent-border)] text-[color:var(--go-accent-text)]'
                  : 'bg-[var(--go-bg-panel)] border-[color:var(--go-border)] text-[color:var(--go-text-muted)] hover:text-[color:var(--go-text-body)] hover:border-white/20'
              }`}
            >
              {key === 'all' ? 'All' : topicLabels[key]}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-[color:var(--go-accent-border)] border-t-[color:var(--go-accent)] rounded-full animate-spin mx-auto" />
              <p className="text-xs text-[color:var(--go-text-secondary)] mt-3">Loading posts...</p>
            </div>
          ) : topLevelPosts.length === 0 ? (
            <Card className="border border-[color:var(--go-border)] bg-[var(--go-bg-panel)] ">
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-12 h-12 text-[color:var(--go-text-meta)] mx-auto mb-3" />
                <p className="text-[11px] text-[color:var(--go-text-muted)]">No posts yet. Be the first to start a conversation!</p>
              </CardContent>
            </Card>
          ) : (
            <AnimatePresence>
              {topLevelPosts.map((post, index) => {
                const replies = getReplies(post.id);
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border border-[color:var(--go-border)] bg-[var(--go-bg-card)] hover:border-[color:var(--go-border)] transition-all">
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center gap-1">
                            <button
                              onClick={() => handleUpvote(post.id, post.upvotes)}
                              className={`transition-colors ${
                                upvotedPosts.has(post.id) 
                                  ? 'text-[color:var(--go-accent-text)] hover:text-[color:var(--go-text-secondary)]' 
                                  : 'text-[color:var(--go-text-secondary)] hover:text-[color:var(--go-accent-text)]'
                              }`}
                            >
                              <ThumbsUp className={`w-4 h-4 ${upvotedPosts.has(post.id) ? 'fill-blue-400' : ''}`} />
                            </button>
                            <span className="text-xs font-mono text-[color:var(--go-text-muted)]">{post.upvotes || 0}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-medium text-[color:var(--go-text)]">{post.author_name}</span>
                              <MinimalBadge variant={topicColors[post.topic]} size="xs">
                                {topicLabels[post.topic]}
                              </MinimalBadge>
                              <span className="text-xs text-[color:var(--go-text-meta)]">{moment(post.created_date).fromNow()}</span>
                            </div>
                            <p className="text-[11px] text-[color:var(--go-text-body)] mb-3 whitespace-pre-wrap leading-relaxed">{post.message}</p>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setReplyingTo(post.id);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="text-xs text-[color:var(--go-text-secondary)] hover:text-[color:var(--go-text)]"
                            >
                              <MessageSquare className="w-3 h-3 mr-1" />
                              Reply {replies.length > 0 && `(${replies.length})`}
                            </Button>

                            {replies.length > 0 && (
                              <div className="mt-4 pl-4 border-l-2 border-[color:var(--go-border)] space-y-3">
                                {replies.map(reply => (
                                  <div key={reply.id} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-medium text-[color:var(--go-text)]">{reply.author_name}</span>
                                      <span className="text-xs text-[color:var(--go-text-meta)]">{moment(reply.created_date).fromNow()}</span>
                                    </div>
                                    <p className="text-xs text-[color:var(--go-text-secondary)] whitespace-pre-wrap">{reply.message}</p>
                                    <button
                                      onClick={() => handleUpvote(reply.id, reply.upvotes)}
                                      className={`flex items-center gap-1 transition-colors ${
                                        upvotedPosts.has(reply.id)
                                          ? 'text-[color:var(--go-accent-text)] hover:text-[color:var(--go-text-muted)]'
                                          : 'text-[color:var(--go-text-muted)] hover:text-[color:var(--go-accent-text)]'
                                      }`}
                                    >
                                      <ThumbsUp className={`w-3 h-3 ${upvotedPosts.has(reply.id) ? 'fill-blue-400' : ''}`} />
                                      <span className="text-xs">{reply.upvotes || 0}</span>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
