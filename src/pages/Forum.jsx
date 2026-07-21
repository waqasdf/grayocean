import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/api/db';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { MinimalBadge } from '@/components/ui/minimal-badge';
import { MessageSquare, ThumbsUp, Send } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import moment from 'moment';
import {
  WorkspacePage,
  WorkspacePanel,
  PrimaryButton,
  GhostButton,
} from '@/components/dashboard';

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

  const topicLabels = {
    general: 'General',
    ssn_analysis: 'SSN Analysis',
    address_intel: 'Address Intel',
    skiptrace: 'Skiptrace',
    support: 'Support',
    feedback: 'Feedback'
  };

  const chipClass = (active) =>
    `rounded-[8px] border px-3 py-1.5 text-[12px] font-medium go-transition ${
      active
        ? 'border-go-primary/40 bg-go-primary/15 text-go-text'
        : 'border-go-border bg-transparent text-go-text-muted hover:border-go-border-strong hover:bg-white/[0.04] hover:text-go-text-secondary'
    }`;

  return (
    <WorkspacePage
      title="Community Forum"
      description="Share insights, ask questions, and get support."
      maxWidth="max-w-[900px]"
      actions={
        <span className="text-[13px] text-go-text-muted">{posts.length} posts</span>
      }
    >
      <div className="space-y-6">
        <WorkspacePanel
          title={replyingTo ? 'Post reply' : 'New post'}
          actions={
            replyingTo ? (
              <MinimalBadge variant="neutral" size="xs">
                Replying to thread
              </MinimalBadge>
            ) : null
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <Input
                placeholder="Your name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="md:w-48 md:flex-shrink-0"
              />
              {!replyingTo && (
                <div className="flex flex-wrap items-center gap-2">
                  {Object.entries(topicLabels).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTopic(key)}
                      className={chipClass(topic === key)}
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
              className="min-h-24"
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              <PrimaryButton
                type="submit"
                className="w-full sm:w-auto"
                disabled={createPostMutation.isPending || !message.trim() || !authorName.trim()}
              >
                <Send className="size-4" />
                {createPostMutation.isPending ? 'Posting...' : 'Post'}
              </PrimaryButton>
              {replyingTo && (
                <GhostButton
                  type="button"
                  className="w-full sm:w-auto"
                  onClick={() => setReplyingTo(null)}
                >
                  Cancel reply
                </GhostButton>
              )}
            </div>
          </form>
        </WorkspacePanel>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13px] text-go-text-muted">Filter:</span>
          {['all', ...Object.keys(topicLabels)].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilterTopic(key)}
              className={chipClass(filterTopic === key)}
            >
              {key === 'all' ? 'All' : topicLabels[key]}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="py-12 text-center">
              <div className="mx-auto size-8 animate-spin rounded-full border-2 border-go-border border-t-go-primary" />
              <p className="mt-3 text-[13px] text-go-text-muted">Loading posts...</p>
            </div>
          ) : topLevelPosts.length === 0 ? (
            <div className="rounded-[10px] border border-go-border bg-go-surface p-12 text-center">
              <MessageSquare className="mx-auto mb-3 size-8 text-go-text-muted" />
              <p className="text-[13px] text-go-text-muted">
                No posts yet. Be the first to start a conversation!
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {topLevelPosts.map((post, index) => {
                const replies = getReplies(post.id);
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <div className="rounded-[10px] border border-go-border bg-go-surface p-4 go-transition hover:border-go-border-strong">
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleUpvote(post.id, post.upvotes)}
                            aria-label="Upvote"
                            className={`inline-flex size-10 items-center justify-center rounded-[8px] go-transition ${
                              upvotedPosts.has(post.id)
                                ? 'text-go-primary hover:text-go-text-secondary'
                                : 'text-go-text-muted hover:text-go-text'
                            }`}
                          >
                            <ThumbsUp
                              className={`size-4 ${upvotedPosts.has(post.id) ? 'fill-current' : ''}`}
                            />
                          </button>
                          <span className="font-mono text-[12px] text-go-text-muted">
                            {post.upvotes || 0}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="text-[13px] font-medium text-go-text">
                              {post.author_name}
                            </span>
                            <MinimalBadge variant="neutral" size="xs">
                              {topicLabels[post.topic]}
                            </MinimalBadge>
                            <span className="text-[12px] text-go-text-muted">
                              {moment(post.created_date).fromNow()}
                            </span>
                          </div>
                          <p className="mb-3 whitespace-pre-wrap text-[13px] leading-relaxed text-go-text-secondary">
                            {post.message}
                          </p>
                          <GhostButton
                            type="button"
                            className="h-8 px-2.5 text-[12px]"
                            onClick={() => {
                              setReplyingTo(post.id);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          >
                            <MessageSquare className="size-3" />
                            Reply {replies.length > 0 && `(${replies.length})`}
                          </GhostButton>

                          {replies.length > 0 && (
                            <div className="mt-4 space-y-3 border-l-2 border-go-border pl-4">
                              {replies.map((reply) => (
                                <div key={reply.id} className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[13px] font-medium text-go-text">
                                      {reply.author_name}
                                    </span>
                                    <span className="text-[12px] text-go-text-muted">
                                      {moment(reply.created_date).fromNow()}
                                    </span>
                                  </div>
                                  <p className="whitespace-pre-wrap text-[13px] text-go-text-secondary">
                                    {reply.message}
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => handleUpvote(reply.id, reply.upvotes)}
                                    className={`flex items-center gap-1 go-transition ${
                                      upvotedPosts.has(reply.id)
                                        ? 'text-go-primary hover:text-go-text-muted'
                                        : 'text-go-text-muted hover:text-go-text'
                                    }`}
                                  >
                                    <ThumbsUp
                                      className={`size-3 ${
                                        upvotedPosts.has(reply.id) ? 'fill-current' : ''
                                      }`}
                                    />
                                    <span className="text-[12px]">{reply.upvotes || 0}</span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </WorkspacePage>
  );
}
