
import React, { useState, useRef, useEffect } from 'react';
import { MOCK_POSTS } from '../constants';
import { IdentityTag, ForumPost } from '../types';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Plus, 
  Flag, 
  ShieldAlert, 
  X, 
  Image as ImageIcon, 
  Camera,
  Send, 
  CheckCircle, 
  MoreVertical, 
  Edit3, 
  Trash2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface Props {
  onShare: () => void;
  autoOpenModal?: boolean;
  onCloseModal?: () => void;
  onBack?: () => void;
  isCareMode?: boolean;
}

const CommunityPage: React.FC<Props> = ({ onShare, autoOpenModal, onCloseModal, onBack, isCareMode }) => {
  const [posts, setPosts] = useState<ForumPost[]>(MOCK_POSTS);
  const [isPosting, setIsPosting] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedTag, setSelectedTag] = useState('就诊体验');
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const currentUserId = 'mock-123'; 

  const tags = ['就诊体验', '心理支持', '生活经验', '勋章展示', '科普讨论'];

  useEffect(() => {
    if (autoOpenModal) {
      setIsPosting(true);
      setEditingPostId(null);
      setPostTitle('');
      setPostContent('');
      setSelectedImages([]);
    }
  }, [autoOpenModal]);

  const handleClosePosting = () => {
    setIsPosting(false);
    if (onCloseModal) onCloseModal();
  };

  const handlePostSubmit = () => {
    if (!postTitle || !postContent) return;

    if (editingPostId) {
      setPosts(prev => prev.map(p => 
        p.id === editingPostId 
          ? { ...p, title: postTitle, content: postContent, tags: [selectedTag], images: selectedImages }
          : p
      ));
      setEditingPostId(null);
    } else {
      const newPost: ForumPost = {
        id: Math.random().toString(36).substr(2, 9),
        userId: currentUserId,
        username: '莘花',
        userType: IdentityTag.PATIENT,
        title: postTitle,
        content: postContent,
        tags: [selectedTag],
        likes: 0,
        comments: 0,
        createdAt: new Date().toISOString().split('T')[0],
        images: selectedImages,
        isPending: true 
      };
      const localPosts = JSON.parse(localStorage.getItem('my_posts') || '[]');
      localStorage.setItem('my_posts', JSON.stringify([newPost, ...localPosts]));
      setPosts(prev => [newPost, ...prev]);
    }

    handleClosePosting();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
    
    setPostTitle('');
    setPostContent('');
    setSelectedImages([]);
    setSelectedTag('就诊体验');
  };

  return (
    <div className={`p-5 space-y-8 relative bg-[#F2F9F6] min-h-full pb-32 ${isCareMode ? 'care-mode-root' : ''}`}>
      {showSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-brand-dark text-white px-6 py-4 rounded-3xl shadow-2xl flex flex-col items-center gap-2 animate-in fade-in border-2 border-brand-core">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-brand-core" />
            <span className="text-sm font-black">帖子已提交成功</span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {onBack && (
          <button onClick={onBack} className={`flex items-center gap-2 text-brand-dark font-black group ${isCareMode ? 'text-lg' : 'text-sm'}`}>
            <ArrowLeft className={isCareMode ? "w-6 h-6 group-hover:-translate-x-1" : "w-4 h-4 group-hover:-translate-x-1"} /> 返回科普
          </button>
        )}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className={`${isCareMode ? 'text-3xl' : 'text-2xl'} font-black text-brand-dark tracking-tight`}>互助社区</h2>
            <p className={`${isCareMode ? 'text-base' : 'text-[13px]'} text-slate-500 font-medium`}>分享真实经验，传递暖心力量</p>
          </div>
        </div>
      </div>

      <div className="columns-2 gap-4 space-y-4">
        {posts.map(post => (
          <div key={post.id} className="break-inside-avoid bg-white rounded-3xl overflow-hidden card-shadow border border-slate-50 flex flex-col relative group">
            {post.images && post.images.length > 0 && (
              <div className="relative aspect-[3/4] overflow-hidden">
                <img src={post.images[0]} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className={`space-y-3 ${isCareMode ? 'p-6' : 'p-4'}`}>
              <h3 className={`font-black text-slate-800 leading-tight line-clamp-2 ${isCareMode ? 'text-lg' : 'text-sm'}`}>{post.title}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className={`${isCareMode ? 'w-8 h-8 text-xs' : 'w-5 h-5 text-[9px]'} rounded-full flex items-center justify-center font-black text-white ${post.userType === IdentityTag.PATIENT ? 'bg-brand-core' : 'bg-brand-orange'}`}>
                    {post.username[0]}
                  </div>
                  <span className={`${isCareMode ? 'text-sm' : 'text-[10px]'} font-bold text-slate-500 truncate max-w-[60px]`}>{post.username}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => setIsPosting(true)}
        className={`${isCareMode ? 'w-20 h-20 bottom-32' : 'w-14 h-14 bottom-28'} fixed right-6 bg-brand-dark text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 border-4 border-white`}
      >
        <Plus className={isCareMode ? "w-10 h-10" : "w-8 h-8"} />
      </button>
    </div>
  );
};

export default CommunityPage;
